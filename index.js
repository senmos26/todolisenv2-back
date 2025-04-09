import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import User from './models/User.js';
import { config } from "dotenv"
import Task from './models/Task.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import bodyParser from 'body-parser'
const app = express();
const port = 3000;
config();
// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  { origin: [process.env.FRONT],methods:['GET','POST','PUT','DELETE'] ,credentials: true }));
 // Autorise les cookies pour les requêtes cross-origin

// Middleware pour vérifier le token JWT


// Routes pour l'authentification


app.use(bodyParser.json());

// Pour parser les requêtes avec des données encodées dans l'URL (par exemple, les formulaires HTML)
app.use(bodyParser.urlencoded({ extended: true }));

// Other task routes (PUT, DELETE) go here
app.use('/tasks', taskRoutes);
app.use('/auth',authRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
app.get('/auth/check', (req, res) => {
  // Récupère le token du cookie
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Si le token est valide, l'utilisateur est authentifié
    res.json({ isAuthenticated: true });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.json({ isAuthenticated: false });
  }
});