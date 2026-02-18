const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, require: true, minlength: [3, 'First name be at least 3 characters or long'] },
        lastname: { type: String, minlength: [3, 'Last name be at least 3 characters or long'] },
    },
    email: { type: String, unique: true, require: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
    password: { type: String, require: true, select: false },
    socketId: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    vehicle: {
        color: { type: String, required: true, minlength: [3, 'Color must be at least 3 characters long'] },
        plate: { type: String, required: true, minlength: [3, 'Plate must be at least 3 characters long'] },
        capacity: { type: Number, required: true, min: [1, 'Capacity must be at least 1'] },
        vehicleType: { type: String, enum: ['car', 'motorcycle', 'auto'], required: true },
        location: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
});


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
};

const captainModel = mongoose.model('captain', captainSchema);  

module.exports = captainModel;