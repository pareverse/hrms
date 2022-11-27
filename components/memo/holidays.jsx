import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, GridItem, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiEdit2, FiMoreHorizontal, FiPlus, FiTrash2 } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import { months } from 'components/months'

const AddModal = () => {
	const queryClient = useQueryClient()
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

	const addHolidays = useMutation((data) => api.create('/holidays', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('holidays')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Holidays added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addHolidays.mutate({
			name: data.name,
			date: data.date
		})
	}

	return (
		<Modal
			title="Add Holidays"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.date}>
						<FormLabel>Date</FormLabel>
						<Input type="date" size="lg" {...register('date', { required: true })} />
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

const EditModal = ({ holidays }) => {
	const queryClient = useQueryClient()
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

	const editHolidays = useMutation((data) => api.update('/holidays', holidays._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('holidays')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Holidays updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editHolidays.mutate({
			name: data.name,
			date: data.date
		})
	}

	return (
		<Modal
			title="Add Holidays"
			toggle={(onOpen) => (
				<MenuItem icon={<FiEdit2 size={16} />} onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Name</FormLabel>
						<Input defaultValue={holidays.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.date}>
						<FormLabel>Date</FormLabel>
						<Input type="date" size="lg" {...register('date', { required: true })} />
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

const Holidays = () => {
	const queryClient = useQueryClient()
	const { data: holidays, isFetched: isHolidaysFetched } = useQuery(['holidays'], () => api.all('/holidays'))
	const toast = useToast()

	const deleteHolidays = useMutation((data) => api.remove('/holidays', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('holidays')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Holidays removed successfully." />
			})
		}
	})

	const onSubmit = (id) => {
		deleteHolidays.mutate(id)
	}

	return (
		<GridItem display="grid" gap={6}>
			<Flex justify="space-between" align="center" gap={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Holidays
				</Text>

				<AddModal />
			</Flex>

			<Card>
				<Table
					data={holidays}
					fetched={isHolidaysFetched}
					th={['Name', 'Date', '']}
					td={(holidays) => (
						<Tr key={holidays._id}>
							<Td>
								<Text textTransform="capitalize">{holidays.name}</Text>
							</Td>

							<Td>
								<Text>
									{months[holidays.date.split('-')[1] - 1]} {holidays.date.split('-')[2]}, {holidays.date.split('-')[0]}
								</Text>
							</Td>

							<Td textAlign="right">
								<Menu placement="bottom-end">
									<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

									<MenuList>
										<EditModal holidays={holidays} />
										<MenuItem icon={<FiTrash2 size={16} />} onClick={() => onSubmit(holidays._id)}>
											Delete
										</MenuItem>
									</MenuList>
								</Menu>
							</Td>
						</Tr>
					)}
					filters={(data, watch) => {
						return data.filter((data) =>
							['name'].some((key) =>
								data[key]
									.toString()
									.toLowerCase()
									.includes(watch('search') && watch('search').toLowerCase())
							)
						)
					}}
					settings={{
						searchWidth: 'full'
					}}
				/>
			</Card>
		</GridItem>
	)
}

export default Holidays
