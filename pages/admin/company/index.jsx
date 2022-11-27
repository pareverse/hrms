import { Container, Grid, GridItem } from '@chakra-ui/react'
import Department from 'components/company/department'
import Designation from 'components/company/designation'

const Company = () => {
	return (
		<Container>
			<Grid templateColumns="1fr 1fr" gap={6}>
				<GridItem colSpan={{ base: 2, lg: 1 }}>
					<Department />
				</GridItem>

				<GridItem colSpan={{ base: 2, lg: 1 }}>
					<Designation />
				</GridItem>
			</Grid>
		</Container>
	)
}

export default Company
