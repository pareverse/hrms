import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { months } from 'components/months'

const Meetings = () => {
	const { data: meetings, isFetched: isMeetingsFetched } = useQuery(['meetings'], () => api.all('/meetings'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Meetings
					</Text>

					<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
				</Flex>

				<Table
					data={meetings}
					fetched={isMeetingsFetched}
					th={['Description', 'Department', 'Date', 'Time', 'Created']}
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
						</Tr>
					)}
					settings={{
						search: 'off',
						show: [5]
					}}
				/>
			</Flex>
		</Card>
	)
}

export default Meetings
