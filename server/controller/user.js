import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const userSignUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "User created successfully" });
};



export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  let user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  const userData = { id: user._id, email: user.email, name: user.name }; // remove password
  return res.status(200).json({ user: userData, token });
};



  export const getUser=async(req,res)=>{
    const user = await User.findById(req.params.id)
    res.json({email:user.email})
 }
