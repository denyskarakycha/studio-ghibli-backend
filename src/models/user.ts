import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId
    }]
});

export default mongoose.model('User', userSchema);