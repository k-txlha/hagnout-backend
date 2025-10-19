import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        unique: true,
        required: true,
    },
    email: {
        type: String, 
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    profilePic: {
        type: String,
        require: true
    }
})

const userModel = mongoose.model('User',userSchema);
export default userModel;

