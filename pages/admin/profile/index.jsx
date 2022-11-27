import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Badge, Box, Button, chakra, Container, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Icon, IconButton, Input, Select, Spinner, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCamera, FiEdit2, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'
import Table from 'components/_table'
import Modal from 'components/_modal'
import { months } from 'components/months'

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

const Profile = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { data: user, isFetched: isUserFetched } = useQuery(['user', session.user.id], () => api.get('/users', session.user.id))
	const { data: department, isFetched: isDepartmentFetched } = useQuery(['department'], () => api.all('/department'))
	const { data: designation, isFetched: isDesignationFetched } = useQuery(['designation'], () => api.all('/designation'))
	const { data: leaves, isFetched: isLeavesFetched } = useQuery(['leaves'], () => api.all('/leaves'))
	const [isLoading, setIsLoading] = useState()
	const toast = useToast()

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		handleSubmit
	} = useForm()

	const editEmployee = useMutation((data) => api.update('/users', session.user.id, data), {
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

										<Select placeholder="Select Department" defaultValue={user.department} size="lg" disabled={session.user.role !== 'Admin'} {...register('department', { required: true })}>
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

										<Select placeholder="Select Department" defaultValue={user.designation} size="lg" disabled={session.user.role !== 'Admin'} {...register('designation', { required: true })}>
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
										<Input type="date" defaultValue={user.hired_date} size="lg" disabled={session.user.role !== 'Admin'} {...register('hired_date', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.contract_end_date}>
										<FormLabel>Contract End Date</FormLabel>
										<Input type="date" defaultValue={user.contract_end_date} size="lg" disabled={session.user.role !== 'Admin'} {...register('contract_end_date', { required: true })} />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</Flex>
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<Text fontSize="lg" fontWeight="semibold" color="accent-1">
									Leave Records
								</Text>

								<Table
									data={leaves}
									fetched={isLeavesFetched}
									th={['Type', 'From', 'To', 'Status', 'Created', '']}
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
										return data.filter((data) => data.user.id === session.user.id).filter((data) => (watch('status') ? watch('status') === data.status : data))
									}}
									effects={(watch) => [watch('status')]}
									settings={{
										search: 'off',
										show: [5]
									}}
								/>
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<Text fontSize="lg" fontWeight="semibold" color="accent-1">
									Report Records
								</Text>

								<Table
									data={[]}
									fetched={true}
									th={[]}
									td={(data, index) => (
										<Tr key={index}>
											<Td>1</Td>
										</Tr>
									)}
									select={(register) => (
										<Flex flex={1} justify="end" align="center" gap={3}>
											<Select size="lg" w="auto">
												<option></option>
											</Select>
										</Flex>
									)}
									settings={{
										search: 'off',
										show: [5]
									}}
								/>
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<Text fontSize="lg" fontWeight="semibold" color="accent-1">
									Request Records
								</Text>

								<Table
									data={[]}
									fetched={true}
									th={[]}
									td={(data, index) => (
										<Tr key={index}>
											<Td>1</Td>
										</Tr>
									)}
									select={(register) => (
										<Flex flex={1} justify="end" align="center" gap={3}>
											<Select size="lg" w="auto">
												<option></option>
											</Select>
										</Flex>
									)}
									settings={{
										search: 'off',
										show: [5]
									}}
								/>
							</Flex>
						</Card>
					</GridItem>
				</Grid>
			</form>
		</Container>
	)
}

export default Profile
