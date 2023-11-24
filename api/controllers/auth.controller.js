import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//sign up
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10); //hash passowrds
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created succesfully");
  } catch (error) {
    next(error); //middleware
  }
};

//sign in
export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  // if email is correct then check password
  try {
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found!')); // if email not correct return this error otherwise check password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong credetials'));// if password is wrong

    // create to hude the password
    const {password: pass, ...rest} = validUser._doc;
    //create token for unique id
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
      res
      .cookie('access_toke', token, { httpOnly: true })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error); //middleware
  }
};