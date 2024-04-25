import mongoose from 'mongoose';

export interface IUser{
    email: string;
    password: string;
    imgUrl: string;
    tokens: string[];
}

const userSchema = new mongoose.Schema<IUser>({
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    imgUrl:{
        type: String,
    },
    tokens:{
        type:[String]
    }
});

export default mongoose.model<IUser>('User',userSchema);