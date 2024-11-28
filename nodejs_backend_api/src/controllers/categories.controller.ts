import { Request, Response, NextFunction } from "express";
import categoriesService from "../services/categories.service";
import { sendJsonSuccess } from "../helpers/responseHandler";

// 1.Get all Categories
const findAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoriesService.findAllCategory(req.query);
    sendJsonSuccess(res, "success")(categories);
  } catch (error) {
    next(error);
  }
};
// 2. Find Category By Id
const findCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await categoriesService.findCategoryById(id);
    return sendJsonSuccess(res, "success")(category);
  } catch (error) {
    next(error);
  }
};

// Find Category By Slug

const findCategoryBySlug = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { slug } = req.params;
    const brand = await categoriesService.findCategoryBySlug(slug);
    return sendJsonSuccess(res, "success")(brand);
  } catch (error) {
    next(error);
  }
};

// 3. Create Category
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const category = await categoriesService.createRecord(payload);
    sendJsonSuccess(res, "success", 201)(category);
  } catch (error) {
    next(error);
  }
};
// 4. update Category
const updateCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const category = await categoriesService.updateCategory(id, payload);
    sendJsonSuccess(res, "success")(category);
  } catch (error) {
    next(error);
  }
};
// 5. delete Category
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const category = await categoriesService.deleteCategory(id);
  sendJsonSuccess(res, "success")(category);
};



export default {
  findAllCategory,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategoryById,
  deleteCategory,
};
