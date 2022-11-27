import mongoose from 'mongoose'

const ReportSchema = mongoose.Schema(
	{
		user_id: {
			type: String,
			default: ''
		},
		user_name: {
			type: String,
			default: ''
		},
		user_email: {
			type: String,
			default: ''
		},
		user_image: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		file: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'unread'
		},
		created: {
			type: String,
			default: ''
		},
		updated: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

const Reports = mongoose.models.Reports || mongoose.model('Reports', ReportSchema)

export default Reports
