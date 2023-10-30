import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({
    content: { type: String }
});
export default mongoose.model('Comment', commentSchema);
