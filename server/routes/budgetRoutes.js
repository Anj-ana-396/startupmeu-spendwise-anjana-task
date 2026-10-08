import express from 'express';
import {
  getBudgets,
  getCurrentBudget,
  setBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { validateBudgetInput } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .get(getBudgets)
  .post(validateBudgetInput, setBudget);

router.route('/current').get(getCurrentBudget);

router
  .route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

export default router;
