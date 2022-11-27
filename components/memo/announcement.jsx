import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
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

	const addAnnouncement = useMutation((data) => api.create('/announcement', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('announcement')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Announcement added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addAnnouncement.mutate({
			name: data.name,
			date: data.date
		})
	}

	return (
		<Modal
			title="Add Announcement"
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

const EditModal = ({ announcement }) => {
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

	const editAnnouncement = useMutation((data) => api.update('/announcement', announcement._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('announcement')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Announcement updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editAnnouncement.mutate({
			name: data.name,
			date: data.date
		})
	}

	return (
		<Modal
			title="Add Announcement"
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
						<Input defaultValue={announcement.name} size="lg" {...register('name', { required: true })} />
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

const Announcement = () => {
	const queryClient = useQueryClient()
	const { data: announcement, isFetched: isAnnouncementFetched } = useQuery(['announcement'], () => api.all('/announcement'))
	const toast = useToast()

	const deleteAnnouncement = useMutation((data) => api.remove('/announcement', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('announcement')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Announcement removed successfully." />
			})
		}
	})

	const onSubmit = (id) => {
		deleteAnnouncement.mutate(id)
	}

	return (
		<GridItem display="grid" gap={6}>
			<Flex justify="space-between" align="center" gap={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Announcement
				</Text>

				<AddModal />
			</Flex>

			<Card>
				<Table
					data={announcement}
					fetched={isAnnouncementFetched}
					th={['Name', 'Date', '']}
					td={(announcement) => (
						<Tr key={announcement._id}>
							<Td>
								<Text textTransform="capitalize">{announcement.name}</Text>
							</Td>

							<Td>
								<Text>
									{months[announcement.date.split('-')[1] - 1]} {announcement.date.split('-')[2]}, {announcement.date.split('-')[0]}
								</Text>
							</Td>

							<Td textAlign="right">
								<Menu placement="bottom-end">
									<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

									<MenuList>
										<EditModal announcement={announcement} />
										<MenuItem icon={<FiTrash2 size={16} />} onClick={() => onSubmit(announcement._id)}>
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

export default Announcement
