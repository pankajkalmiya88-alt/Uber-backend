const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		// documents will automatically be removed 24 hours after `createdAt`
		expires: 60 * 60 * 24 // seconds (24 hours)
	}
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);

