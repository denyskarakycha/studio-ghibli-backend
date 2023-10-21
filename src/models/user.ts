import mongoose, { Schema, Document } from 'mongoose';
import { ICommentModel } from './comment.js'



export interface IUserModel extends Document {
    email: string;
    password: String;
    watchLater: mongoose.Types.ObjectId[]
    watched: mongoose.Types.ObjectId[]
    comments: mongoose.Types.ObjectId[]
}


const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    watchLater: [{
        type: Schema.Types.ObjectId,
    }],
    watched: [{
        type: Schema.Types.ObjectId,
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});


export default mongoose.model<IUserModel>('User', userSchema);