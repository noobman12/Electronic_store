import express from "express";
import orderController from "../../controllers/orders.controllers";
import { checkCustomerToken } from "../../middlewares/customer.middleware";
const router = express.Router();

//1. Get All orders
router.get('', orderController.findAll)

// // 2.Find orders By Id
router.get('/:id', orderController.findById)

// // 3.Create orders
router.post('', checkCustomerToken, orderController.createRecord)

// // // 4.update orders by id
router.put('/:id', orderController.updateById)

// // // 5.delete orders
router.delete('/:id', orderController.deleteById)

export default router