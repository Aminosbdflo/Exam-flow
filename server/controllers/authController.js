import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "exams-7f8c9"
  });
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const jwtToken = generateToken(user._id);
    
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const jwtToken = generateToken(user._id);
    
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      console.error('Google Auth Error: No token provided');
      return res.status(400).json({ message: 'No token provided' });
    }

    // Verify Firebase ID Token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (verifyError) {
      console.error('Firebase Token Verification Error:', verifyError.message);
      return res.status(401).json({ message: 'Google Token Verification Failed: ' + verifyError.message });
    }

    const { name, email, picture, uid: googleId } = decodedToken;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Attempting to create new Google user:', email);
      try {
        user = await User.create({
          googleId,
          name: name || email.split('@')[0], // Fallback if name is missing
          email,
          avatar: picture,
          role: 'user'
        });
        console.log('Successfully created user:', user.email);
      } catch (createError) {
        console.error('User.create Error Details:', createError);
        throw createError; // Re-throw to be caught by the general catch block
      }
    }

    const jwtToken = generateToken(user._id);
    
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (error) {
    console.error('FULL Google Auth Error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
