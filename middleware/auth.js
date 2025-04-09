import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protect = (req, res, next) => {
  const token = req.cookies.token; // 🔐 récupère depuis le cookie

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalide' });
      } else {
        req.userId = decodedToken._id;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Aucun token fourni' });
  }
};

export default protect;
