import mongoose, { Schema, Document } from 'mongoose';


export interface IUserModel extends Document {
    email: string;
    password: String;
    comments: Schema.Types.ObjectId[]
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

export default mongoose.model<IUserModel>('User', userSchema);