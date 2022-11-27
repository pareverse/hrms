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
	const { data: reportTypes, isFetched: isReportTypesFetched } = useQuery(['report_types'], () => api.all('/reports/types'))
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

	const addReportsMutation = useMutation((data) => api.create('/reports', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('employee_reports')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Report successfully filed." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addReportsMutation.mutate({
			user: {
				id: session.user.id
			},
			...data
		})
	}

	return (
		<Modal
			title="Add Reports"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Add Reports
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.description}>
						<FormLabel>Description</FormLabel>
						<Input size="lg" {...register('description', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.type}>
						<FormLabel>Type</FormLabel>

						<Select placeholder="Select" size="lg" {...register('type', { required: true })}>
							{isReportTypesFetched &&
								reportTypes.map((type) => (
									<chakra.option textTransform="capitalize" value={type.name} key={type._id}>
										{type.name}
									</chakra.option>
								))}
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.file}>
						<FormLabel>File</FormLabel>
						<Input type="file" size="lg" {...register('file', { required: true })} />
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

const ViewModal = ({ report }) => {
	const disclosure = useDisclosure()

	return (
		<Modal header="off" toggle={(onOpen) => <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={onOpen} />} disclosure={disclosure}>
			<form>
				<Flex direction="column" gap={6}>
					<FormControl>
						<FormLabel>Description</FormLabel>
						<Input value={report.description} size="lg" textTransform="capitalize" readOnly />
					</FormControl>

					<FormControl>
						<FormLabel>Type</FormLabel>
						<Input value={report.type} size="lg" textTransform="capitalize" readOnly />
					</FormControl>

					<FormControl>
						<FormLabel>File</FormLabel>
						<Input value={report.file} size="lg" textTransform="capitalize" readOnly />
					</FormControl>
				</Flex>
			</form>
		</Modal>
	)
}

const Reports = () => {
	const { data: session } = useSession()
	const { data: reports, isFetched: isReportsFetched } = useQuery(['employee_reports'], () => api.get('/reports/employee', session.user.id))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Reports
					</Text>

					<AddModal session={session} />
				</Flex>

				<Card>
					<Table
						data={reports}
						fetched={isReportsFetched}
						th={['Description', 'Type', 'File', 'Status', 'Created', '']}
						td={(report) => (
							<Tr key={report._id}>
								<Td>
									<Text textTransform="capitalize">{report.description}</Text>
								</Td>

								<Td>
									<Text textTransform="capitalize">{report.type}</Text>
								</Td>

								<Td>
									<Text textTransform="capitalize">{report.file}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" textTransform="capitalize" colorScheme={report.status === 'read' ? 'brand' : report.status === 'unread' && 'default'}>
										{report.status}
									</Badge>
								</Td>

								<Td>
									<Text>
										{months[report.created.split(',')[0].split('/')[0] - 1]} {report.created.split(',')[0].split('/')[1]}, {report.created.split(',')[0].split('/')[2]}
									</Text>
								</Td>

								<Td textAlign="right">
									<ViewModal report={report} />
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

Reports.authentication = {
	authorized: 'Employee'
}

export default Reports
