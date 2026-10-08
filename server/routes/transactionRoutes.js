import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { validateTransactionInput } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .get(getTransactions)
  .post(validateTransactionInput, createTransaction);

router
  .route('/:id')
  .get(getTransactionById)
  .put(validateTransactionInput, updateTransaction)
  .delete(deleteTransaction);

export default router;
