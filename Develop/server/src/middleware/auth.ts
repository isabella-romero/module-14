import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Split to get token after 'Bearer'

  // If no token is provided, respond with an error
  if (!token) {
    res.status(401).json({ message: 'Unauthorized. No token provided.' });
    return; // Make sure we return after sending a response
  }

  try {
    // Verify the token
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });

    // If valid, add the decoded user data to the request object
    req.user = decoded;
    next(); // Pass the control to the next middleware/route handler

  } catch (err) {
    // If an error occurs in token verification
    res.status(403).json({ message: 'Invalid token.' });
    return; // Ensure we return after sending the response
  }
};
