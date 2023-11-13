// auth.js
import express from 'express';

const authRouter = express.Router();

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Read username and passsord from auth database
  const validUsername = 'yourUsername'; 
  const validPassword = 'yourPassword';

  const { username, password } = req.body;

  if (username === validUsername && password === validPassword) {
    next(); // User is authenticated, proceed to the next middleware/route
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply authentication middleware to all routes defined in authRouter
authRouter.use(authMiddleware);

// Login route
authRouter.post('/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

// Logout route
authRouter.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default authRouter;
