import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { chakra, Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'
import Unauthorized from 'components/unauthorized'
import Suspended from 'components/suspended'
import Restricted from 'components/restricted'
import Inactive from 'components/inactive'

const AppLayout = (props) => {
	const router = useRouter()
	const { data: session, status } = useSession()
	const isAdmin = session ? (session.user.role === 'Admin' ? true : false) : false
	const isEmployee = session ? (session.user.role === 'Employee' ? true : false) : false
	const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure()

	if (status === 'loading') {
		return (
			<Flex justify="center" align="center" h="100vh" w="full">
				<Spinner size="xl" thickness={2} speed="0.8s" emptyColor="canvas-1" color="brand.default" />
			</Flex>
		)
	} else {
		if (!session && props.authentication) {
			router.push('/')
			return null
		}

		if (!session && router.pathname === '/profile') {
			router.push('/')
			return null
		}

		if (session && session.user.role === 'User') {
			return (
				<>
					<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />
					<Unauthorized />
				</>
			)
		}

		if (session && session.user.status === 'suspended') {
			return (
				<>
					<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />
					<Suspended />
				</>
			)
		}

		if (session && session.user.status === 'restricted') {
			return (
				<>
					<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />
					<Restricted />
				</>
			)
		}

		if (session && session.user.status === 'inactive') {
			return (
				<>
					<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />
					<Inactive />
				</>
			)
		}

		if (session && session.user.role === 'Employee' && router.pathname === '/') {
			router.push('/dashboard')
			return null
		}

		if (!isAdmin && router.pathname.includes('admin')) {
			router.push('/')
			return
		}

		if (isAdmin && !router.pathname.includes('admin')) {
			router.push('/admin/dashboard')
			return
		}

		// if (session && props.authentication && props.authentication.authorized) {
		// 	if (session.user.role !== props.authentication.authorized) {
		// 		router.push('/')
		// 		return
		// 	}
		// }

		return (
			<>
				<Header session={session} isAdmin={isAdmin} isEmployee={isEmployee} onSidebarOpen={onSidebarOpen} />

				<chakra.div position="relative" mx="auto" w="full" maxW={1536}>
					{session && <Sidebar session={session} isAdmin={isAdmin} isEmployee={isEmployee} isSidebarOpen={isSidebarOpen} onSidebarClose={onSidebarClose} />}
					<chakra.main ml={{ base: 'full', lg: session ? 256 : 'full' }} w="full" maxW={{ base: 'full', lg: session ? 'calc(100% - 256px)' : 'full' }} {...props} />
				</chakra.div>
			</>
		)
	}
}

export default AppLayout
