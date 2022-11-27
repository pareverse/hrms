import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Badge, Button, chakra, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const AddModal = ({ department, isDepartmentFetched, designation, isDesignationFetched }) => {
	const queryClient = useQueryClient()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const disclosure1 = useDisclosure()
	const disclosure2 = useDisclosure()
	const [selectedUser, setSelectedUser] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addEmployee = useMutation((data) => api.update('/users', selectedUser._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)
			disclosure1.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Employee added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addEmployee.mutate({
			department: data.department,
			designation: data.designation,
			gender: data.gender,
			contact: data.contact,
			date_of_birth: data.date_of_birth,
			address: data.address,
			role: 'Employee'
		})
	}

	return (
		<Modal
			title="Add Employee"
			size="xl"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={() => setSelectedUser(null) || clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={disclosure1}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						{selectedUser ? (
							<Flex align="center" gap={3}>
								<Avatar name={selectedUser.name} src={selectedUser.image} boxSize="44px" />

								<Flex direction="column">
									<Text fontSize="sm" fontWeight="medium" color="accent-1">
										{selectedUser.name}
									</Text>

									<Text mt={-1} fontSize="sm" fontWeight="medium">
										{selectedUser.email}
									</Text>
								</Flex>
							</Flex>
						) : (
							<Flex align="center" gap={3}>
								<SkeletonCircle boxSize="44px" />

								<Flex direction="column" gap={2}>
									<Skeleton h={2} w={32} />
									<Skeleton h={2} w={24} />
								</Flex>
							</Flex>
						)}

						{selectedUser ? (
							<Button variant="tinted" colorScheme="brand" onClick={() => setSelectedUser(null)}>
								Remove
							</Button>
						) : (
							<Modal
								title="Select User"
								size="xl"
								toggle={(onOpen) => (
									<Button variant="tinted" size="lg" colorScheme="brand" onClick={onOpen}>
										Select User
									</Button>
								)}
								disclosure={disclosure2}
							>
								<Table
									data={users}
									fetched={isUsersFetched && isDepartmentFetched && isDesignationFetched}
									th={[]}
									td={(user) => (
										<Tr key={user._id}>
											<Td>
												<Flex align="center" gap={3}>
													<Avatar name={user.name} src={user.image} boxSize={10} />

													<Flex direction="column">
														<Text>{user.name}</Text>

														<Text mt={-1} color="accent-3">
															{user.email}
														</Text>
													</Flex>
												</Flex>
											</Td>

											<Td textAlign="right">
												<Button variant="tinted" colorScheme="brand" onClick={() => setSelectedUser(user) || disclosure2.onClose()}>
													Select
												</Button>
											</Td>
										</Tr>
									)}
									filters={(data, watch) => {
										return data
											.filter((data) =>
												['name', 'email'].some((key) =>
													data[key]
														.toString()
														.toLowerCase()
														.includes(watch('search') && watch('search').toLowerCase())
												)
											)
											.filter((data) => data.role === 'User')
									}}
									settings={{
										searchWidth: 'full'
									}}
								/>
							</Modal>
						)}
					</Flex>

					<Divider />

					{selectedUser && (
						<>
							<FormControl isInvalid={errors.department}>
								<FormLabel>Department</FormLabel>

								<Select placeholder="Select" size="lg" {...register('department', { required: true })}>
									{department.map((department) => (
										<option value={department.name} key={department._id}>
											{department.name}
										</option>
									))}
								</Select>

								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={errors.designation}>
								<FormLabel>Designation</FormLabel>

								<Select placeholder="Select" size="lg" {...register('designation', { required: true })}>
									{designation.map((designation) => (
										<option value={designation.name} key={designation._id}>
											{designation.name}
										</option>
									))}
								</Select>

								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={errors.hired_date}>
								<FormLabel>Hired Date</FormLabel>
								<Input type="date" size="lg" {...register('hired_date', { required: true })} />
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl>
								<FormLabel>
									Contract End Date
									<chakra.em color="accent-3">(optional)</chakra.em>
								</FormLabel>

								<Input type="date" size="lg" {...register('contract_end_date')} />
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>
						</>
					)}

					<Flex justify="end" align="center" gap={3}>
						<Button size="lg" onClick={disclosure1.onClose}>
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

const Employees = () => {
	const router = useRouter()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: department, isFetched: isDepartmentFetched } = useQuery(['department'], () => api.all('/department'))
	const { data: designation, isFetched: isDesignationFetched } = useQuery(['designation'], () => api.all('/designation'))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Employees
					</Text>

					<AddModal department={department} isDepartmentFetched={isDepartmentFetched} designation={designation} isDesignationFetched={isDesignationFetched} />
				</Flex>

				<Card>
					<Table
						data={users}
						fetched={isUsersFetched}
						th={['Name', 'Email', 'Department', 'Designation', 'Status', '']}
						td={(user) => (
							<Tr key={user._id}>
								<Td>
									<Flex align="center" gap={3}>
										<Avatar name={user.name} src={user.image} />
										<Text>{user.name}</Text>
									</Flex>
								</Td>

								<Td>
									<Text>{user.email}</Text>
								</Td>

								<Td>
									<Text>{user.department}</Text>
								</Td>

								<Td>
									<Text>{user.designation}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" textTransform="capitalize" colorScheme={user.status === 'active' ? 'brand' : user.status === 'suspended' ? 'yellow' : user.status === 'restricted' ? 'red' : user.status === 'inactive' && 'default'}>
										{user.status}
									</Badge>
								</Td>

								<Td textAlign="right">
									<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} onClick={() => router.push(`/admin/employees/${user._id}`)} />
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" align="center" direction={{ base: 'column', md: 'row' }} gap={3}>
								<Select placeholder="Department" size="lg" w={{ base: 'full', md: 'auto' }} {...register('department')}>
									{isDepartmentFetched &&
										department.map((department) => (
											<option value={department.name} key={department._id}>
												{department.name}
											</option>
										))}
								</Select>

								<Select placeholder="Designation" size="lg" w={{ base: 'full', md: 'auto' }} {...register('designation')}>
									{isDesignationFetched &&
										designation.map((designation) => (
											<option value={designation.name} key={designation._id}>
												{designation.name}
											</option>
										))}
								</Select>

								<Select placeholder="Status" size="lg" w={{ base: 'full', md: 'auto' }} {...register('status')}>
									<option value="active">Active</option>
									<option value="suspended">Suspended</option>
									<option value="restricted">Restricted</option>
									<option value="inactive">Inactive</option>
								</Select>
							</Flex>
						)}
						filters={(data, watch) => {
							return data
								.filter((data) => data.role === 'Employee')
								.filter((data) =>
									['name', 'email'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
								.filter((data) => (watch('department') ? watch('department') === data.department : data))
								.filter((data) => (watch('designation') ? watch('designation') === data.designation : data))
								.filter((data) => (watch('status') ? watch('status') === data.status : data))
						}}
						effects={(watch) => [watch('department'), watch('designation'), watch('status')]}
					/>
				</Card>
			</Flex>
		</Container>
	)
}

export default Employees
