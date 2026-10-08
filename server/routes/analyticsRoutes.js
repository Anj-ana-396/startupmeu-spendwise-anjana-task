import express from 'express';
import {
  getSummary,
  getCategoriesBreakdown,
  getMonthlyTrends,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.route('/summary').get(getSummary);
router.route('/categories').get(getCategoriesBreakdown);
router.route('/monthly').get(getMonthlyTrends);

export default router;
