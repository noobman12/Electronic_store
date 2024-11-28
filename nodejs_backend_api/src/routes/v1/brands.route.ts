import express from "express";
import brandsController from "../../controllers/brands.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

// 1.Get all Brands
router.get("", brandsController.allBrands);

router.get("/slug/:slug", brandsController.findBrandBySlug);
// 2.Find Brand By Id
router.get("/:id", brandsController.findBrandById);

router.use(authenticateToken);

// 3.Create Brand

router.post("", brandsController.createBrand);

// 4.update Brand
router.put("/:id", brandsController.updateBrandById);

// 5.delete Brand
router.delete("/:id", brandsController.deleteBrand);

export default router;
