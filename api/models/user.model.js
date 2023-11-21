import mongoose from 'mongoose'

//user schema first
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },

}, {timestamps: true}); //record time of creation of the user/ time of update of the user

//create model
const User = mongoose.model('User', userSchema);

export default User;