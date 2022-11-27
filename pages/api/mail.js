import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	const msg = {
		to: 'tanfelizarta@gmail.com',
		from: process.env.EMAIL_FROM,
		subject: 'Commence Test',
		text: 'easy to do anywhere, even with Node.js',
		html: '<strong>easy to do anywhere, even with Node.js</strong>'
	}

	sgMail
		.send(msg)
		.then(() => {
			res.status(200).send('request success.')
		})
		.catch((error) => {
			res.status(400).send('request failed.')
		})
}
