import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { months } from 'components/months'

const Holidays = () => {
	const { data: holidays, isFetched: isHolidaysFetched } = useQuery(['holidays'], () => api.all('/holidays'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Holidays
					</Text>

					<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
				</Flex>

				<Table
					data={holidays}
					fetched={isHolidaysFetched}
					th={['Description', 'Date']}
					td={(holidays) => (
						<Tr key={holidays._id}>
							<Td>
								<Text textTransform="capitalize">{holidays.name}</Text>
							</Td>

							<Td>
								<Text>
									{months[holidays.date.split('-')[1] - 1]} {holidays.date.split('-')[2]}, {holidays.date.split('-')[0]}
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

export default Holidays
