import mongoose from 'mongoose'

const LeaveSchema = mongoose.Schema(
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
		type: {
			type: String,
			default: ''
		},
		from: {
			type: String,
			default: ''
		},
		to: {
			type: String,
			default: ''
		},
		days: {
			type: Number,
			default: 0
		},
		approved_by: {
			type: Object,
			default: {}
		},
		approved_date: {
			type: String,
			default: ''
		},
		rejected_by: {
			type: Object,
			default: {}
		},
		rejected_date: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'waiting'
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

const Leaves = mongoose.models.Leaves || mongoose.model('Leaves', LeaveSchema)

export default Leaves
