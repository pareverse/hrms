import { Container, Grid } from '@chakra-ui/react'
import Meetings from 'components/memo/meetings/admin'
import Announcement from 'components/memo/announcement'
import Holidays from 'components/memo/holidays'

const Memorandum = () => {
	return (
		<Container>
			<Grid alignItems="start" templateColumns="1fr 1fr" gap={6}>
				<Meetings />
				<Announcement />
				<Holidays />
			</Grid>
		</Container>
	)
}

export default Memorandum
