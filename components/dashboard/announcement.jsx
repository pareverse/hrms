import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const Announcement = () => {
	const { data: announcement, isFetched: isAnnouncementFetched } = useQuery(['announcement'], () => api.all('/announcement'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Announcement
					</Text>

					<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
				</Flex>

				<Table
					data={announcement}
					fetched={isAnnouncementFetched}
					th={['Description']}
					td={(announcement) => (
						<Tr key={announcement._id}>
							<Td>
								<Text>{announcement.name}</Text>
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

export default Announcement
