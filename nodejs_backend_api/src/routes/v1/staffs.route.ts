import express from "express";
import staffsController from "../../controllers/staffs.controller";
import validateSchema from "../../middlewares/validateSchema.middleware";
import staffsValidation from "../../validations/staffs.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticateToken)
// 1. Get all staffs
router.get('', staffsController.allStaffs);

// 2. Get staff By id
router.get('/:id', staffsController.findStafftById)

// 3. Create new staff
router.post('', validateSchema(staffsValidation.createRecord), staffsController.createStaffRecord)

// 4. Update Staff
router.put('/:id', validateSchema(staffsValidation.updateRecord), staffsController.updateStaffById)

// 5 Delete staff
router.delete('/:id', staffsController.deleteStaffbyId)

export default router
