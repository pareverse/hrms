import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, GridItem, IconButton, Input, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import { months } from 'components/months'

const AddModal = () => {
	const queryClient = useQueryClient()
	const { data: department, isFetched: isDepartmentFetched } = useQuery(['department'], () => api.all('/department'))
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addMeetings = useMutation((data) => api.create('/meetings', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('meetimgs')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Employee added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		addMeetings.mutate(data)
	}

	return (
		<Modal
			title="Add Meetings"
			size="xl"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
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

					<FormControl isInvalid={errors.department}>
						<FormLabel>Department</FormLabel>
						<Select placeholder="Select Department" size="lg" {...register('department', { required: true })}>
							<option value="all">All</option>
							{isDepartmentFetched && department.map((department) => <option key={department._id}>{department.name}</option>)}
						</Select>
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.date}>
						<FormLabel>Date</FormLabel>
						<Input type="date" size="lg" {...register('date', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.time}>
						<FormLabel>Time</FormLabel>
						<Input type="time" size="lg" {...register('time', { required: true })} />
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

const Meetings = () => {
	const { data: meetings, isFetched: isMeetingsFetched } = useQuery(['meetings'], () => api.all('/meetings'))

	return (
		<GridItem display="grid" gap={6} colSpan={2}>
			<Flex justify="space-between" align="center" gap={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Meetings
				</Text>

				<AddModal />
			</Flex>

			<Card>
				<Table
					data={meetings}
					fetched={isMeetingsFetched}
					th={['Description', 'Department', 'Date', 'Time', 'Created', '']}
					td={(meeting) => (
						<Tr key={meeting._id}>
							<Td>
								<Text textTransform="capitalize">{meeting.description}</Text>
							</Td>

							<Td>
								<Text textTransform="capitalize">{meeting.department}</Text>
							</Td>

							<Td>
								<Text>
									{months[meeting.date.split('-')[1] - 1]} {meeting.date.split('-')[2]}, {meeting.date.split('-')[0]}
								</Text>
							</Td>

							<Td>
								<Text>{meeting.time}</Text>
							</Td>

							<Td>
								<Text>
									{months[meeting.created.split(',')[0].split('/')[0] - 1]} {meeting.created.split(',')[0].split('/')[1]}, {meeting.created.split(',')[0].split('/')[2]}
								</Text>
							</Td>

							<Td textAlign="right">
								<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
							</Td>
						</Tr>
					)}
				/>
			</Card>
		</GridItem>
	)
}

export default Meetings
