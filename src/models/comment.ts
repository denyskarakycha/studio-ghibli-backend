import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: [{
        type: String
    }]
});

export default mongoose.model('Comment', commentSchema);