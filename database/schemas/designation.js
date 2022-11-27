import mongoose from 'mongoose'

const DesignationSchema = mongoose.Schema(
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

const Designation = mongoose.models.Designation || mongoose.model('Designation', DesignationSchema)

export default Designation
