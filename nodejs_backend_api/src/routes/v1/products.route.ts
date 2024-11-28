import express from "express";
import productsController from "../../controllers/products.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//========== API PUBLIC ======//
router.get("/slug/:slug", productsController.findProductBySlug);
router.get("/brand/:slug", productsController.getAllByBrandSlug);
router.get("/category/:slug", productsController.getAllByCategorySlug);
/**
 * Get ALl Products
 * GET /api/v1/products
 */
router.get("", productsController.findAllProduct);
router.use(authenticateToken);

/**
 * Get Single Product
 * GET /api/v1/products/:id
 */
router.get("/:id", productsController.findOneProductId);
//  * create new Product
//  * POST /api/v1/products
//  */
router.post("", productsController.createDocument);
//  * update Product
//  * PUT /api/v1/products/:id
//  */
router.put("/:id", productsController.updateById);
//  * Xóa sản phẩm
//  * DELETE /api/v1/products/:id
//  */
router.delete("/:id", productsController.deleteById);

export default router;
