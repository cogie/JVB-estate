import mongoose from "mongoose";

//user schema first
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQLHZh0aF5Og2DF4G19yPVx_QGjXfaBByFZA&usqp=CAU",
    },
    // //must add a contact info from the user
    //contact: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // }
  },
  { timestamps: true }
); //record time of creation of the user/ time of update of the user

//create model
const User = mongoose.model("User", userSchema);

export default User;
