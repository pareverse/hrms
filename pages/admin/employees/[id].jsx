import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Box, Button, chakra, Container, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Icon, IconButton, Input, Select, Spinner, Text, useToast } from '@chakra-ui/react'
import { FiCamera, FiEdit2 } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'
import Leave from 'components/employees/leave'

const Employee = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { data: user, isFetched: isUserFetched } = useQuery(['user', id], () => api.get('/users', id))
	const { data: department, isFetched: isDepartmentFetched } = useQuery(['department'], () => api.all('/department'))
	const { data: designation, isFetched: isDesignationFetched } = useQuery(['designation'], () => api.all('/designation'))
	const [isLoading, setIsLoading] = useState()
	const toast = useToast()

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		handleSubmit
	} = useForm()

	const editEmployee = useMutation((data) => api.update('/users', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Employee updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		editEmployee.mutate(data)
	}

	useEffect(() => {
		if (isUserFetched) {
			setValue('role', user.role)
			setValue('status', user.status)
		}
	}, [isUserFetched])

	if (!isUserFetched || !isDepartmentFetched || !isDesignationFetched) {
		return (
			<Flex p={6}>
				<Spinner color="brand.default" />
			</Flex>
		)
	}

	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid alignItems="start" templateColumns="300px 1fr" gap={6}>
					<GridItem display="grid" gap={6} colSpan={{ base: 2, lg: 1 }}>
						<Card>
							<Flex justify="center" p={6}>
								<Box position="relative">
									<Avatar name={user.name} src={user.image} size="2xl" />

									<Flex bg="white" overflow="hidden" position="absolute" bottom={0} right={0} justify="center" align="center" border="1px" borderColor="border" borderRadius="full" h={8} w={8}>
										<Icon as={FiCamera} size={16} />
										<Input type="file" position="absolute" left={0} h={24} w={24} cursor="pointer" opacity={0} />
									</Flex>
								</Box>
							</Flex>
						</Card>

						{session.user.role === 'Admin' && (
							<Card>
								<Flex direction="column" gap={6}>
									<Flex justify="space-between" align="center" gap={6}>
										<Text fontSize="lg" fontWeight="semibold" color="accent-1">
											Role
										</Text>

										<chakra.span bg={watch('role') === 'Admin' ? 'yellow.default' : watch('role') === 'Employee' && 'blue.default'} borderRadius="full" h={5} w={5} />
									</Flex>

									<Select defaultValue={user.role} size="lg" {...register('role')}>
										<option value="Employee">Employee</option>
										<option value="Admin">Admin</option>
									</Select>
								</Flex>
							</Card>
						)}

						<Card>
							<Flex direction="column" gap={6}>
								<Flex justify="space-between" align="center" gap={6}>
									<Text fontSize="lg" fontWeight="semibold" color="accent-1">
										Status
									</Text>

									<chakra.span bg={watch('status') === 'active' ? 'brand.default' : watch('status') === 'suspended' ? 'yellow.default' : watch('status') === 'restricted' ? 'red.default' : watch('status') === 'inactive' && 'accent-3'} borderRadius="full" h={5} w={5} />
								</Flex>

								<Select defaultValue={user.status} size="lg" {...register('status')}>
									<option value="active">Active</option>
									<option value="suspended">Suspended</option>
									<option value="restricted">Restricted</option>
									<option value="inactive">Inactive</option>
								</Select>

								{watch('status') === 'suspended' && (
									<FormControl isInvalid={errors.suspended_duration}>
										<FormLabel>Duration</FormLabel>
										<Input type="date" defaultValue={user.suspended_duration} size="lg" {...register('suspended_duration', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								)}
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<Flex justify="space-between" align="center" gap={6}>
									<Text fontSize="lg" fontWeight="semibold" color="accent-1">
										Resume
									</Text>

									<IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiEdit2 size={12} />} />
								</Flex>

								<Button size="lg">tristan...docx</Button>

								{/* <Button variant="tinted" size="lg" colorScheme="brand">
								Upload
							</Button> */}
							</Flex>
						</Card>
					</GridItem>

					<GridItem display="grid" gap={6} colSpan={{ base: 2, lg: 1 }}>
						<Card>
							<Flex direction="column" gap={6}>
								<Flex justify="space-between" align="center" gap={6}>
									<Text fontSize="lg" fontWeight="semibold" color="accent-1">
										Personal Information
									</Text>

									<Button type="submit" colorScheme="brand" isLoading={isLoading}>
										Save Changes
									</Button>
								</Flex>

								<FormControl isInvalid={errors.name}>
									<FormLabel>Full Name</FormLabel>
									<Input defaultValue={user.name} size="lg" {...register('name', { required: true })} />
									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								<FormControl>
									<FormLabel>Email</FormLabel>
									<Input defaultValue={user.email} size="lg" cursor="not-allowed" readOnly />
									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								<Flex align="center" direction={{ base: 'column', md: 'row', lg: 'column', xl: 'row' }} gap={6}>
									<FormControl>
										<FormLabel>Department</FormLabel>

										<Select defaultValue={user.department} size="lg" {...register('department', { required: true })}>
											{department.map((department) => (
												<option value={department.name} key={department._id}>
													{department.name}
												</option>
											))}
										</Select>

										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>

									<FormControl>
										<FormLabel>Designation</FormLabel>

										<Select defaultValue={user.designation} size="lg" {...register('designation', { required: true })}>
											{designation.map((designation) => (
												<option value={designation.name} key={designation._id}>
													{designation.name}
												</option>
											))}
										</Select>

										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</Flex>

								<Flex align="center" direction={{ base: 'column', md: 'row', lg: 'column', xl: 'row' }} gap={6}>
									<FormControl>
										<FormLabel>Gender</FormLabel>

										<Select defaultValue={user.gender} size="lg" {...register('gender')}>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</Select>

										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.contact}>
										<FormLabel>Contact</FormLabel>
										<Input defaultValue={user.contact} size="lg" {...register('contact', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.date_of_birth}>
										<FormLabel>Date of Birth</FormLabel>
										<Input type="date" defaultValue={user.date_of_birth} size="lg" {...register('date_of_birth', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</Flex>

								<FormControl isInvalid={errors.address}>
									<FormLabel>Address</FormLabel>
									<Input defaultValue={user.address} size="lg" {...register('address', { required: true })} />
									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								<Flex align="center" direction={{ base: 'column', md: 'row', lg: 'column', xl: 'row' }} gap={6}>
									<FormControl isInvalid={errors.hired_date}>
										<FormLabel>Hired Date</FormLabel>
										<Input type="date" defaultValue={user.hired_date} size="lg" {...register('hired_date', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.contract_end_date}>
										<FormLabel>Contract End Date</FormLabel>
										<Input type="date" defaultValue={user.contract_end_date} size="lg" {...register('contract_end_date', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</Flex>
							</Flex>
						</Card>

						<Leave id={id} />
					</GridItem>
				</Grid>
			</form>
		</Container>
	)
}

export default Employee
