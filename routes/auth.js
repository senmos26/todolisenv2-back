import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

 
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de l\'inscription de l\'utilisateur' });
  }
});




router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const utilisateur = await User.findOne({ email });

    if (!utilisateur) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const payload = { _id: utilisateur._id, username: utilisateur.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 🔐 Envoie du token dans un cookie HTTPOnly
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // en prod: true
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 heure
      })
      .status(200)
      .json({ message: 'Connexion réussie', user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de la connexion' });
  }
});

// Route pour la déconnexion
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  // La déconnexion est gérée côté client en supprimant le token du localStorage
  res.status(200).json({ message: 'Déconnexion réussie' });
});

export default router;
