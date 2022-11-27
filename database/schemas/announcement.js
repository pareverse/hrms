import mongoose from 'mongoose'

const AnnouncementSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		date: {
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

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema)

export default Announcement
