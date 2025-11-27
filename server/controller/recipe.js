import Recipes from '../models/recipe.js'
import multer from 'multer';

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});
export const upload = multer({ storage: storage });

// GET all recipes
export const getRecipes = async (req, res) => {
  const recipes = await Recipes.find();
  return res.json(recipes);
};

// GET single recipe by ID
export const getRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  res.json(recipe);
};

// Add a new recipe
export const addRecipe = async (req, res) => {
  try {
    const { title, time, instructions } = req.body;
    let ingredients = [];

    // Parse ingredients (handle JSON string or single string)
    try {
      ingredients = req.body.ingredients
        ? JSON.parse(req.body.ingredients)
        : [];
    } catch (err) {
      ingredients = [req.body.ingredients];
    }

    if (!title || !instructions || !ingredients.length) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    const recipe = new Recipes({
      title,
      time,
      ingredients,
      instructions,
      coverImage: req.file ? req.file.filename : null,
      createdBy: req.user.id,
    });

    const newRecipe = await recipe.save();
    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit a recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Parse ingredients safely
    let ingredients = recipe.ingredients;
    if (req.body.ingredients) {
      try {
        ingredients = JSON.parse(req.body.ingredients);
      } catch {
        ingredients = [req.body.ingredients];
      }
    }

    const updatedData = {
      title: req.body.title || recipe.title,
      time: req.body.time || recipe.time,
      instructions: req.body.instructions || recipe.instructions,
      ingredients,
    };

   // ✅ Only update coverImage if a new file is uploaded
    if (req.file) {
      updatedData.coverImage = req.file.filename;
    } else {
      updatedData.coverImage = recipe.coverImage; // keep old image
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json(updatedRecipe);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// DELETE recipe
export const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipes.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.set("Cache-Control", "no-store");
    return res.json({ message: "Recipe deleted successfully", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
