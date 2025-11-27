import { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe, upload } from '../controller/recipe.js';
import verifyToken from '../middleware/auth.js';
import { Router } from 'express';
const router = Router();
//getAll
router.get("/",getRecipes)

// get by id
router.get("/:id",getRecipe)

// add recipe
router.post("/addRecipe",upload.single('coverImage'),verifyToken,addRecipe)

// Edit recipe
router.put("/updateRecipe/:id",upload.single("image"),verifyToken,updateRecipe)

// delete recipe
router.delete("/:id",verifyToken,deleteRecipe)


export default router;