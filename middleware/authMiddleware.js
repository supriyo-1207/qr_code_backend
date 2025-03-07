import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    token = token.split(' ')[1]; // Remove "Bearer " prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT

    req.user = decoded; // Attach user info to request
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Token failed, not authorized' });
  }
};
