import connect from 'database/connect'
import Reports from 'database/schemas/reports'

export default async (req, res) => {
	const { id } = req.query
	await connect()

	try {
		const data = await Reports.find({}).sort({ createdAt: -1 })
		const results = data.filter((data) => data.user_id === id)
		res.status(200).send(results)
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
