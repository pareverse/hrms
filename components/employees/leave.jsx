import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Badge, chakra, Flex, FormControl, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
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

const Leave = ({ id }) => {
	const { data: leaves, isFetched: isLeavesFetched } = useQuery(['leaves'], () => api.all('/leaves'))
	const { register, watch } = useForm()

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						Leave Records
					</Text>

					<Select placeholder="Status" size="lg" w="auto" {...register('status')}>
						<chakra.option value="waiting">Waiting</chakra.option>
						<chakra.option value="approved">Approved</chakra.option>
						<chakra.option value="rejected">Rejected</chakra.option>
					</Select>
				</Flex>

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
					filters={(data) => {
						return data.filter((data) => data.user.id === id).filter((data) => (watch('status') ? watch('status') === data.status : data))
					}}
					effects={(watch) => [watch('status')]}
					settings={{
						search: 'off',
						show: [5]
					}}
				/>
			</Flex>
		</Card>
	)
}

export default Leave
