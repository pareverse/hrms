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

	const addDesignation = useMutation((data) => api.create('/designation', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('designation')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Designation added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addDesignation.mutate({
			name: data.name.toLowerCase()
		})
	}

	return (
		<Modal
			title="Add Designation"
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

const EditModal = ({ designation }) => {
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

	const editDesignation = useMutation((data) => api.update('/designation', designation._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('designation')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Designation updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editDesignation.mutate({
			name: data.name.toLowerCase()
		})
	}

	return (
		<Modal
			title="Add Designation"
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
						<Input defaultValue={designation.name} size="lg" {...register('name', { required: true })} />
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

const Designation = () => {
	const queryClient = useQueryClient()
	const { data: designation, isFetched: isDesignationFetched } = useQuery(['designation'], () => api.all('/designation'))

	const toast = useToast()

	const deleteDesignation = useMutation((data) => api.remove('/designation', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('designation')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Designation removed successfully." />
			})
		}
	})

	const onSubmit = (id) => {
		deleteDesignation.mutate(id)
	}

	return (
		<Grid gap={6}>
			<GridItem>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Designation
					</Text>

					<AddModal />
				</Flex>
			</GridItem>

			<GridItem>
				<Card>
					<Table
						data={designation}
						fetched={isDesignationFetched}
						th={['Name', , '']}
						td={(designation) => (
							<Tr key={designation._id}>
								<Td>
									<Text textTransform="capitalize">{designation.name}</Text>
								</Td>

								<Td textAlign="right">
									<Menu placement="bottom-end">
										<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

										<MenuList>
											<EditModal designation={designation} />
											<MenuItem icon={<FiTrash2 size={16} />} onClick={() => onSubmit(designation._id)}>
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
		</Grid>
	)
}

export default Designation
