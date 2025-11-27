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
console.log(__dirname);

const PORT = process.env.PORT || 3000;
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

//use the client app
app.use(express.static(path.join(__dirname,'/client/dist')))

// Render client for any path
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
