import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../DataBase/Schema.js'; 
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};


router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      // role defaults to 'user' as per your schema
    });

    if (user) {
      // 4. Send back success response with token
      res.status(201).json({
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/login', async (req, res) => {  
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND if the password matches the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Send back user data and a fresh token
      res.json({
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;