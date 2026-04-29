import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: function () {
            // required only if no social login is used
            return !this.googleId && !this.linkedinId;
        }
    },

    // 🔵 Google OAuth
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    // 🔷 LinkedIn OAuth
    linkedinId: {
        type: String,
        unique: true,
        sparse: true
    },

    avatar: {
        type: String,
        default: ""
    },

    authProvider: {
        type: String,
        enum: ["local", "google", "linkedin"],
        default: "local"
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;