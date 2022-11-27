import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { chakra, Flex, Grid, GridItem, Icon, Link, Text } from '@chakra-ui/react'
import { FiArchive, FiFilePlus, FiFileText, FiGrid, FiLogOut, FiPieChart, FiStar, FiUser, FiUsers, FiVolume2 } from 'react-icons/fi'

const Sidebar = ({ session, isAdmin, isEmployee, isSidebarOpen, onSidebarClose }) => {
	const router = useRouter()

	return (
		<>
			<chakra.div display={{ base: 'block', lg: 'none' }} bg="hsla(0, 0%, 0%, 0.4)" position="fixed" top={0} left={0} h="100vh" w="full" visibility={isSidebarOpen ? 'visible' : 'hidden'} opacity={isSidebarOpen ? 1 : 0} transition="0.4s ease-in-out" zIndex={99} onClick={onSidebarClose} />

			<chakra.aside bg="white" position="fixed" top={{ base: 0, lg: 'auto' }} left={{ base: isSidebarOpen ? 0 : -256, lg: 'auto' }} borderRight="1px solid" borderColor="border" h="100vh" w={256} transition="0.4s ease-in-out" zIndex={100} _dark={{ bg: 'hsl(230, 20%, 12%)' }}>
				<Grid templateRows="1fr" h="full">
					{isAdmin && (
						<GridItem display="grid" alignContent="start" justify="start" gap={1} p={6}>
							<NextLink href="/admin/dashboard" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('dashboard') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiPieChart} boxSize={4} />
										<Text>Dashboard</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/company" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('company') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiGrid} boxSize={4} />
										<Text>Company</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/employees" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('employees') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiUsers} boxSize={4} />
										<Text>Employees</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/leaves" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('leaves') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiLogOut} boxSize={4} />
										<Text>Leaves</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/reports" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('reports') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiFileText} boxSize={4} />
										<Text>Reports</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/request" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('request') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiFilePlus} boxSize={4} />
										<Text>Request</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/memo" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('memo') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiVolume2} boxSize={4} />
										<Text>Memo</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/accounts" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('accounts') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiStar} boxSize={4} />
										<Text>Accounts</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/admin/archive" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('archive') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiArchive} boxSize={4} />
										<Text>Archive</Text>
									</Flex>
								</Link>
							</NextLink>
						</GridItem>
					)}

					{isEmployee && (
						<GridItem display="grid" alignContent="start" justify="start" gap={1} p={6}>
							<NextLink href="/dashboard" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('dashboard') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiPieChart} boxSize={4} />
										<Text>Dashboard</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/leaves" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('leaves') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiLogOut} boxSize={4} />
										<Text>Leaves</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/reports" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('reports') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiFileText} boxSize={4} />
										<Text>Reports</Text>
									</Flex>
								</Link>
							</NextLink>

							<NextLink href="/request" passHref>
								<Link as="span" display="block" py={2} lineHeight={6} active={router.pathname.includes('request') ? 1 : 0} onClick={onSidebarClose}>
									<Flex align="center" gap={3}>
										<Icon as={FiFilePlus} boxSize={4} />
										<Text>Request</Text>
									</Flex>
								</Link>
							</NextLink>
						</GridItem>
					)}
				</Grid>
			</chakra.aside>
		</>
	)
}

export default Sidebar
