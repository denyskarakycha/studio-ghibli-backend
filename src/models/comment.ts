import mongoose, {Schema, Document} from "mongoose";

interface ICommentModel extends Document {
    content: String
}

const commentSchema: Schema = new Schema({
    content: [{
        type: String
    }]
});

export default mongoose.model<ICommentModel>('Comment', commentSchema);