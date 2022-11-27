import mongoose from 'mongoose'

const ReportTypeSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
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

const ReportTypes = mongoose.models.ReportTypes || mongoose.model('ReportTypes', ReportTypeSchema)

export default ReportTypes
