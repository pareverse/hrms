import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import { Avatar, Button, chakra, Flex, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FiLogOut, FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { Google } from 'components/_logos'

const Header = ({ session, isAdmin, isEmployee, onSidebarOpen }) => {
	const router = useRouter()
	const { colorMode, toggleColorMode } = useColorMode()
	const colorModeIcon = useColorModeValue(<FiMoon size={16} fill="currentColor" />, <FiSun size={16} fill="currentColor" />)

	return (
		<chakra.header bg="brand.default" position="sticky" top={0} zIndex={99}>
			<Flex align="center" gap={6} mx="auto" px={6} h={16} w="full" maxW={1536}>
				<Flex flex={1} justify="start" align="center">
					<IconButton display={{ base: 'flex', lg: 'none' }} icon={<FiMenu size={16} />} onClick={onSidebarOpen} />

					<Text display={{ base: 'none', lg: 'block' }} fontSize="xl" fontWeight="semibold" color="white">
						CitiXpress Inc.
					</Text>
				</Flex>

				<Flex flex={1} justify="end" align="center">
					{session ? (
						<Menu closeOnSelect={false}>
							<MenuButton>
								<Avatar name={session.user.name} src={session.user.image} />
							</MenuButton>

							<MenuList w={256}>
								<MenuItem onClick={() => (session.user.role === 'Admin' ? router.push('/admin/profile') : router.push('/profile'))}>
									<Flex align="center" gap={3}>
										<Avatar name={session.user.name} src={session.user.image} />

										<Text color="accent-1" noOfLines={1}>
											{session.user.name}
										</Text>
									</Flex>
								</MenuItem>

								<MenuDivider />

								<MenuItem textTransform="capitalize" icon={colorModeIcon} onClick={toggleColorMode}>
									{colorMode} Mode
								</MenuItem>

								<MenuItem icon={<FiLogOut size={16} />} onClick={() => signOut()}>
									Sign Out
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<Button leftIcon={<Google size={20} />} onClick={() => signIn('google')}>
							Sign in
						</Button>
					)}
				</Flex>
			</Flex>
		</chakra.header>
	)
}

export default Header
