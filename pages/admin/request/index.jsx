import { Button, Container, Flex, FormControl, FormLabel, IconButton, Input, Td, Text, Tr, useDisclosure } from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'

const AddModal = () => {
	const disclosure = useDisclosure()

	return (
		<Modal
			title="Add Request"
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
						<FormLabel>Name</FormLabel>
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

const Request = () => {
	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Request
					</Text>

					<AddModal />
				</Flex>

				<Card>
					<Table
						data={['', '', '', '', '']}
						fetched={true}
						th={['Name', 'Email', 'Contact', 'Department', 'Designation', '']}
						td={(data, index) => (
							<Tr key={index}>
								<Td>
									<Text>Administration</Text>
								</Td>

								<Td>
									<Text>employee@gmail.com</Text>
								</Td>

								<Td>
									<Text>091324325</Text>
								</Td>

								<Td>
									<Text>Administration</Text>
								</Td>

								<Td>
									<Text>Administration</Text>
								</Td>

								<Td textAlign="right">
									<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
								</Td>
							</Tr>
						)}
						settings={{
							search: 'off'
						}}
					/>
				</Card>
			</Flex>
		</Container>
	)
}

export default Request
