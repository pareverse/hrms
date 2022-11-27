import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, Container, Flex, FormControl, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'

const AddModal = () => {
	const disclosure = useDisclosure()

	return (
		<Modal
			title="Add Accounts"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiPlus size={16} />} onClick={onOpen}>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form>
				<Flex direction="column" gap={6}>
					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input size="lg" />
					</FormControl>

					<Flex justify="end" align="center" gap={3}>
						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button size="lg" colorScheme="brand">
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Accounts = () => {
	const router = useRouter()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Accounts
					</Text>

					<AddModal />
				</Flex>

				<Card>
					<Table
						data={users}
						fetched={isUsersFetched}
						th={['Full Name', 'Email', 'Role', 'Status', '']}
						td={(user) => (
							<Tr key={user._id}>
								<Td maxW={200}>
									<Flex align="center" gap={3}>
										<Avatar name={user.name} src={user.image} />

										<Text overflow="hidden" textOverflow="ellipsis">
											{user.name}
										</Text>
									</Flex>
								</Td>

								<Td>
									<Text>{user.email}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme={user.role === 'Admin' ? 'yellow' : user.role === 'Employee' ? 'blue' : user.role === 'User' && 'red'}>
										{user.role}
									</Badge>
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
								.filter((data) => data.role !== 'User')
								.filter((data) =>
									['name', 'email'].some((key) =>
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

export default Accounts
