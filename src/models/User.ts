import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export as a function to prevent model creation at build time
export default function getUser() {
    // Delete cached model to prevent schema conflicts
    if (mongoose.models.User) {
        delete mongoose.models.User;
    }
    return mongoose.model('User', UserSchema);
}
