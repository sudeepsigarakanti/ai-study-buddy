import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        maxlength: [60, 'Username cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export as a function to prevent model creation at build time
export default function getUser() {
    return mongoose.models.User || mongoose.model('User', UserSchema);
}

