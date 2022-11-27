import connect from 'database/connect'
import Users from 'database/schemas/users'
import Reports from 'database/schemas/reports'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Reports.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body
				const user = await Users.findById({ _id: data.user.id })

				await Reports.create({
					user_id: data.user.id,
					user_name: user.name,
					user_email: user.email,
					user_image: user.image,
					description: data.description,
					type: data.type,
					file,
					days: calcDate(data.from, data.to).total_days,
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
				console.log(req.body)
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
