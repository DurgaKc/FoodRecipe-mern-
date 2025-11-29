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

// Resolving __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static files
app.use(express.static('public'));

// Routes
app.use('/', userRoutes);
app.use('/recipe', recipeRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, '/client/dist')));

// Catch-all route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
