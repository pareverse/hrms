import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Badge, Button, chakra, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus, FiTrash2 } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import { months } from 'components/months'
import { calcDate } from 'functions/calculate-date'

const LeaveTypesModal = () => {
	const queryClient = useQueryClient()
	const { data: leaveTypes, isFetched: isLeaveTypesFetched } = useQuery(['leave_types'], () => api.all('/leaves/types'))
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState(false)
	const [selectedId, setSelectedId] = useState(null)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addTypeMutation = useMutation((data) => api.create('/leaves/types', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('leave_types')
			reset()
			setIsLoading(false)

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Leave type added successfully." />
			})
		}
	})

	const deleteTypeMutation = useMutation((id) => api.remove('/leaves/types', id), {
		onSuccess: () => {
			queryClient.invalidateQueries('leave_types')
			setIsDeleteLoading(false)

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Leave type removed successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addTypeMutation.mutate({
			name: data.name.toLowerCase()
		})
	}

	const onDelete = (id) => {
		setIsDeleteLoading(true)
		setSelectedId(id)
		deleteTypeMutation.mutate(id)
	}

	return (
		<Modal
			title="Leave Types"
			size="xl"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Leave Types
				</Button>
			)}
			disclosure={disclosure}
		>
			<Flex direction="column" gap={6}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Flex align="center" gap={3}>
						<FormControl isInvalid={errors.name}>
							<Input placeholder="Name" size="lg" {...register('name', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<IconButton type="submit" variant="tinted" size="lg" colorScheme="brand" icon={<FiPlus size={16} />} isLoading={isLoading} onClick={onsubmit} />
					</Flex>
				</form>

				<Divider />

				<Table
					data={leaveTypes}
					fetched={isLeaveTypesFetched}
					th={[]}
					td={(type) => (
						<Tr key={type._id}>
							<Td>
								<Text textTransform="capitalize">{type.name}</Text>
							</Td>

							<Td textAlign="right">
								<IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiTrash2 size={12} />} isLoading={selectedId === type._id && isDeleteLoading} onClick={() => onDelete(type._id)} />
							</Td>
						</Tr>
					)}
					settings={{
						search: 'off'
					}}
				/>
			</Flex>
		</Modal>
	)
}

const ViewModal = ({ session, leave }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isApproveLoading, setIsApproveLoading] = useState(false)
	const [isRejectLoading, setIsRejectLoading] = useState(false)
	const toast = useToast()

	//console.log(calcDate(leave.from, leave.to))

	const leaveMutation = useMutation((data) => api.update('/leaves', leave._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('leaves')
			setIsApproveLoading(false)
			setIsRejectLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Leave successfully approved." />
			})
		}
	})

	const onApproved = () => {
		setIsApproveLoading(true)

		leaveMutation.mutate({
			user: {
				id: leave.user.id
			},
			status: 'approved',
			approved_by: session.user.id
		})
	}

	const onRejected = () => {
		setIsRejectLoading(true)

		leaveMutation.mutate({
			user: {
				id: leave.user.id
			},
			status: 'rejected',
			rejected_by: session.user.id
		})
	}

	return (
		<Modal header="off" toggle={(onOpen) => <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={onOpen} />} disclosure={disclosure}>
			<form>
				<Flex direction="column" gap={6}>
					<FormControl>
						<FormLabel>Type</FormLabel>
						<Input value={leave.type} size="lg" textTransform="capitalize" readOnly />
					</FormControl>

					<FormControl>
						<FormLabel>From</FormLabel>
						<Input type="date" value={leave.from} size="lg" readOnly />
					</FormControl>

					<FormControl>
						<FormLabel>To</FormLabel>
						<Input type="date" value={leave.to} size="lg" readOnly />
					</FormControl>

					{leave.status === 'approved' && (
						<>
							<FormControl>
								<FormLabel>Approved By</FormLabel>
								<Input value={leave.approved_by.email} size="lg" readOnly />
							</FormControl>

							<FormControl>
								<FormLabel>Approved Date</FormLabel>
								<Input value={leave.approved_date} size="lg" readOnly />
							</FormControl>
						</>
					)}

					{leave.status === 'rejected' && (
						<>
							<FormControl>
								<FormLabel>Rejected By</FormLabel>
								<Input value={leave.rejected_by.email} size="lg" readOnly />
							</FormControl>

							<FormControl>
								<FormLabel>Rejected Date</FormLabel>
								<Input value={leave.rejected_date} size="lg" readOnly />
							</FormControl>
						</>
					)}

					{leave.status !== 'approved' && leave.status !== 'rejected' && (
						<Flex align="center" gap={6}>
							<Button size="lg" colorScheme="red" w="full" isLoading={isRejectLoading} onClick={onRejected}>
								Reject
							</Button>

							<Button size="lg" colorScheme="brand" w="full" isLoading={isApproveLoading} onClick={onApproved}>
								Approve
							</Button>
						</Flex>
					)}
				</Flex>
			</form>
		</Modal>
	)
}

const Leaves = () => {
	const { data: session } = useSession()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: leaves, isFetched: isLeavesFetched } = useQuery(['leaves'], () => api.all('/leaves'))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Leaves
					</Text>

					<LeaveTypesModal />
				</Flex>

				<Card>
					<Table
						data={leaves}
						fetched={isUsersFetched && isLeavesFetched}
						th={['Employee', 'Leave Type', 'From', 'To', 'Days', 'Status', 'Created', '']}
						td={(leave) => (
							<Tr key={leave._id}>
								<Td>
									<Flex align="center" gap={3}>
										<Avatar name={leave.user_name} src={leave.user_image} />
										<Text>{leave.user_name}</Text>
									</Flex>
								</Td>

								<Td>
									<Text textTransform="capitalize">{leave.type}</Text>
								</Td>

								<Td>
									<Text>
										{months[leave.from.split('-')[1] - 1]} {leave.from.split('-')[2]}, {leave.from.split('-')[0]}
									</Text>
								</Td>

								<Td>
									<Text>
										{months[leave.to.split('-')[1] - 1]} {leave.to.split('-')[2]}, {leave.to.split('-')[0]}
									</Text>
								</Td>

								<Td>
									<Text>{leave.days}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" textTransform="capitalize" colorScheme={leave.status === 'approved' ? 'brand' : leave.status === 'rejected' ? 'red' : leave.status === 'waiting' && 'yellow'}>
										{leave.status}
									</Badge>
								</Td>

								<Td>
									<Text>
										{months[leave.created.split(',')[0].split('/')[0] - 1]} {leave.created.split(',')[0].split('/')[1]}, {leave.created.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td textAlign="right">
									<ViewModal session={session} leave={leave} />
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" align="center" gap={3}>
								<Select placeholder="Status" size="lg" w="auto" {...register('status')}>
									<chakra.option value="waiting">Waiting</chakra.option>
									<chakra.option value="approved">Approved</chakra.option>
									<chakra.option value="rejected">Rejected</chakra.option>
								</Select>
							</Flex>
						)}
						filters={(data, watch) => {
							return data
								.filter((data) =>
									['user_name', 'type', 'from', 'to', 'days'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
								.filter((data) => (watch('status') ? watch('status') === data.status : data))
						}}
						effects={(watch) => [watch('status')]}
					/>
				</Card>
			</Flex>
		</Container>
	)
}

export default Leaves
