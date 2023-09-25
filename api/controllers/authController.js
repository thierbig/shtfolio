const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET="iamsecret12345"


exports.googleSignIn = async (req, res) => {
    try {
      // Your Google sign-in logic here
      res.json({ message: "User signed in successfully", email: "user@example.com" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
  
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  
    res.json({ token, user });
  };
  
  exports.checkAuth = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.json({ user });
  };
  
  exports.register = async (req, res) => {
    const { email, password } = req.body;
  
    let user = await User.findOne({ email });
  
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    user = new User({
      email,
      password: hashedPassword,
    });
  
    await user.save();
  
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  
    res.json({ token, user });
  };