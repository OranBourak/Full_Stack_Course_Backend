import mongoose from 'mongoose';

export interface IItem{
    name: string;
    owner: string;
}

const itemSchema = new mongoose.Schema<IItem>({
    name:{
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'Student' // Reference the Student model
    },
});

export default mongoose.model<IItem>('Item',itemSchema);