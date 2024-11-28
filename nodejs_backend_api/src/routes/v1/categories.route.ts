import express from "express";
import categoriesController from "../../controllers/categories.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/slug/:slug", categoriesController.findCategoryBySlug);
//1. Get All Categories
router.get("", categoriesController.findAllCategory);

// 2.Find Category By Id
router.get("/:id", categoriesController.findCategoryById);
router.use(authenticateToken);

// 3.Create Category
router.post("", categoriesController.createCategory);

// // 4.update Category By ID
router.put("/:id", categoriesController.updateCategoryById);

// // 5.delete Category
router.delete("/:id", categoriesController.deleteCategory);

export default router;
