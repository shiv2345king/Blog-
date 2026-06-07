import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.linkedinId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    linkedinId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "linkedin"],
      default: "local",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});



/* ================= PASSWORD CHECK ================= */
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;

  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;