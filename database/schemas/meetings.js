import mongoose from 'mongoose'

const MeetingSchema = mongoose.Schema(
	{
		description: {
			type: String,
			default: ''
		},
		department: {
			type: String,
			default: ''
		},
		date: {
			type: String,
			default: ''
		},
		time: {
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

const Meetings = mongoose.models.Meetings || mongoose.model('Meetings', MeetingSchema)

export default Meetings
