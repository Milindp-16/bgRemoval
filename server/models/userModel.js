import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId      : { type: String, required: true, unique: true },
  email        : { type: String, required: true, unique: true },
  photo        : { type: String, required: true },
  firstName    : { type: String },
  lastName     : { type: String },
  creditBalance: { type: Number, default: 5 }
}, {
  collection: "users"      // ← explicitly force the collection name
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
