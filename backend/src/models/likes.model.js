import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    likedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;