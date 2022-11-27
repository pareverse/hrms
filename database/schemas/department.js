import mongoose from 'mongoose'

const DepartmentSchema = mongoose.Schema(
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

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)

export default Department
