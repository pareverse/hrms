import connect from 'database/connect'
import Users from 'database/schemas/users'
import Leaves from 'database/schemas/leaves'
import sgMail from '@sendgrid/mail'
import { calcDate } from 'functions/calculate-date'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Leaves.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body
				const user = await Users.findById({ _id: data.user.id })

				await Leaves.create({
					user_id: data.user.id,
					user_name: user.name,
					user_email: user.email,
					user_image: user.image,
					type: data.type,
					from: data.from,
					to: data.to,
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
				const { id, data } = req.body
				const employee = await Users.findById({ _id: data.user.id })

				if (data.status === 'approved') {
					const admin = await Users.findById({ _id: data.approved_by })

					await Leaves.findByIdAndUpdate(
						{ _id: id },
						{
							user: {
								id: data.user.id
							},
							status: data.status,
							approved_by: {
								name: admin.name,
								email: admin.email,
								image: admin.image
							},
							approved_date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
							updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
						}
					)

					const template = {
						to: employee.email,
						from: process.env.EMAIL_FROM,
						subject: 'Your Leave Approved!',
						html: `approved by ${admin.email}`
					}

					sgMail.send(template)
					return res.status(200).send('request success.')
				} else {
					const admin = await Users.findById({ _id: data.rejected_by })

					await Leaves.findByIdAndUpdate(
						{ _id: id },
						{
							user: {
								id: data.user.id
							},
							status: data.status,
							rejected_by: {
								name: admin.name,
								email: admin.email,
								image: admin.image
							},
							rejected_date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
							updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
						}
					)

					const template = {
						to: employee.email,
						from: process.env.EMAIL_FROM,
						subject: 'Your Leave is Rejected!',
						html: `rejected by ${admin.email}`
					}

					sgMail.send(template)
				}

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
