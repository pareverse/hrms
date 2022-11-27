import connect from 'database/connect'
import Meetings from 'database/schemas/meetings'
import Users from 'database/schemas/users'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Meetings.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body
				const users = await Users.find({})
				const employees = users.filter((user) => user.role === 'Employee').filter((user) => (data.department !== 'all' ? user.department === data.department : user))
				let emails = []

				employees.map((employee) => {
					emails.push(employee.email)
				})

				await Meetings.create({
					...data,
					created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				})

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
				console.log(req.body)
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		default:
			res.status(400).send('request failed.')
			break
	}
}
