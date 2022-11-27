import { Container, Grid, GridItem } from '@chakra-ui/react'
import Statistics from 'components/dashboard/statistics/employee'
import Announcement from 'components/dashboard/announcement'
import Meetings from 'components/dashboard/meetings'
import Holidays from 'components/dashboard/holidays'

const Dashboard = () => {
	return (
		<Container>
			<Grid templateColumns="repeat(12, 1fr)" gap={6}>
				<Statistics />

				<GridItem colSpan={12}>
					<Meetings />
				</GridItem>

				<GridItem colSpan={{ base: 12, xl: 6 }}>
					<Announcement />
				</GridItem>

				<GridItem colSpan={{ base: 12, xl: 6 }}>
					<Holidays />
				</GridItem>
			</Grid>
		</Container>
	)
}

Dashboard.authentication = {
	authorized: 'Employee'
}

export default Dashboard
