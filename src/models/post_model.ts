import mongoose from 'mongoose';

export interface IPost{
    title: string;
    message: string;
    owner: string;
}

const postSchema = new mongoose.Schema<IPost>({
    title:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'User' // Reference the User model
    },
});

export default mongoose.model<IPost>('Post',postSchema);