import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Badge, Button, chakra, Container, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import { months } from 'components/months'

const AddModal = ({ session }) => {
	const queryClient = useQueryClient()
	const { data: leaveTypes, isFetched: isLeaveTypesFetched } = useQuery(['leave_types'], () => api.all('/leaves/types'))
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState()
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addLeavesMutation = useMutation((data) => api.create('/leaves', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('employee_leaves')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Leave successfully filed." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addLeavesMutation.mutate({
			user: {
				id: session.user.id
			},
			...data
		})
	}

	return (
		<Modal
			title="Add Leave"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Add Leave
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.type}>
						<FormLabel>Type</FormLabel>

						<Select placeholder="Select" size="lg" {...register('type', { required: true })}>
							{isLeaveTypesFetched &&
								leaveTypes.map((type) => (
									<chakra.option textTransform="capitalize" value={type.name} key={type._id}>
										{type.name}
									</chakra.option>
								))}
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.from}>
						<FormLabel>From</FormLabel>
						<Input type="date" size="lg" {...register('from', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.to}>
						<FormLabel>To</FormLabel>
						<Input type="date" size="lg" {...register('to', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Flex justify="end" align="center" gap={3}>
						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const ViewModal = ({ leave }) => {
	const disclosure = useDisclosure()

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
				</Flex>
			</form>
		</Modal>
	)
}

const Leaves = () => {
	const { data: session } = useSession()
	const { data: leaves, isFetched: isLeavesFetched } = useQuery(['employee_leaves'], () => api.get('/leaves/employee', session.user.id))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Leaves
					</Text>

					<AddModal session={session} />
				</Flex>

				<Card>
					<Table
						data={leaves}
						fetched={isLeavesFetched}
						th={['Type', 'From', 'To', 'Days', 'Status', 'Created', '']}
						td={(leave) => (
							<Tr key={leave._id}>
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
									<ViewModal leave={leave} />
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
							return data.filter((data) => (watch('status') ? watch('status') === data.status : data))
						}}
						effects={(watch) => [watch('status')]}
						settings={{
							search: 'off'
						}}
					/>
				</Card>
			</Flex>
		</Container>
	)
}

Leaves.authentication = {
	authorized: 'Employee'
}

export default Leaves
