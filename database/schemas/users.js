import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			required: true
		},
		image: {
			type: String,
			default: ''
		},
		department: {
			type: String,
			default: ''
		},
		designation: {
			type: String,
			default: ''
		},
		gender: {
			type: String,
			default: ''
		},
		contact: {
			type: String,
			default: ''
		},
		date_of_birth: {
			type: String,
			default: ''
		},
		address: {
			type: String,
			default: ''
		},
		hired_date: {
			type: String,
			default: ''
		},
		contract_end_date: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			default: 'User'
		},
		status: {
			type: String,
			default: 'active'
		},
		suspended_duration: {
			type: String,
			default: ''
		},
		deleted: {
			type: Boolean,
			default: true
		},
		archive: {
			type: Boolean,
			default: true
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

const Users = mongoose.models.Users || mongoose.model('Users', UserSchema)

export default Users
