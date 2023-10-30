import mongoose, {Schema, Document} from 'mongoose';


export interface IRatingModel extends Document {
    filmId: mongoose.Types.ObjectId
    totalCountVotes: number,
    totalSum: number,
    averageRating: number,
    setRating: (mark: number) => Promise<IRatingModel>,
    updateRating: (oldmark: number, mark: number) => Promise<IRatingModel>
}

const ratingShema: Schema<IRatingModel> = new Schema({    
    filmId: {
        type: Schema.Types.ObjectId,
    },
    totalCountVotes: {
        type: Number,
        default: 0
    },
    totalSum: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
    }
});

ratingShema.method('setRating', async function (mark: number): Promise<IRatingModel> {

    this.totalCountVotes++; 
 
    this.totalSum = this.totalSum + mark;

    this.averageRating = Number((this.totalSum / this.totalCountVotes).toFixed(2));
    return await this.save();
});

ratingShema.method('updateRating', async function (oldmark: number, mark: number): Promise<IRatingModel> {
    this.totalSum = this.totalSum - oldmark;
    if(!this.totalCountVotes && !this.totalSum) {
        this.averageRating = 0;
    } else {
        this.totalSum = this.totalSum + mark;
        this.averageRating = Number((this.totalSum / this.totalCountVotes).toFixed(2));
    }
    return await this.save();
});

export default mongoose.model<IRatingModel>("Rating", ratingShema);