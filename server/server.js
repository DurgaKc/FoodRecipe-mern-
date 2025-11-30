import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectionDb.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/user.js';
import recipeRoutes from './routes/recipe.js';

dotenv.config();
const app = express();

// dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORRECT for same-domain deployment
app.use(cors());
app.set("trust proxy", 1);

// Static uploads
app.use(express.static('public'));

// API Routes
app.use('/', userRoutes);
app.use('/recipe', recipeRoutes);

// Serve frontend build (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
