import connect from 'database/connect'
import Users from 'database/schemas/users'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Users.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				const { id, data } = req.body

				await Users.findByIdAndUpdate(
					{ _id: id },
					{
						...data,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				if (data.status !== 'suspended') {
					await Users.findByIdAndUpdate(
						{ _id: id },
						{
							suspended_duration: ''
						}
					)
				}

				const user = await Users.findById({ _id: id })

				const template = {
					to: user.email,
					from: process.env.EMAIL_FROM,
					subject: 'You have been promoted as Employee!',
					html: '<strong>You have been promoted as Employee you can sign in now.</strong>'
				}

				sgMail.send(template)
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
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
