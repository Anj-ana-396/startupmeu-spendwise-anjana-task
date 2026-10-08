import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// Helper to calculate spending for a given month and year
const calculateMonthlySpending = async (month, year, category = 'All') => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const matchStage = {
    type: 'expense',
    date: { $gte: startDate, $lte: endDate },
  };

  if (category && category !== 'All') {
    matchStage.category = category;
  }

  const result = await Transaction.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
  ]);

  return result.length > 0 ? Math.round(result[0].totalSpent * 100) / 100 : 0;
};

// @desc    Get all budgets with computed spending status
// @route   GET /api/budgets
// @access  Public
export const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const budgets = await Budget.find(filter).sort({ year: -1, month: -1 }).lean();

    // Enrich each budget with live calculated spending and status
    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateMonthlySpending(budget.month, budget.year, budget.category);
        const remaining = Math.round((budget.limit - spent) * 100) / 100;
        const percentageUsed = budget.limit > 0 ? Math.round((spent / budget.limit) * 1000) / 10 : 0;

        let status = 'normal';
        let statusMessage = 'On track';

        if (spent > budget.limit) {
          status = 'exceeded';
          statusMessage = `Budget exceeded by $${(spent - budget.limit).toFixed(2)}`;
        } else if (percentageUsed >= 80) {
          status = 'warning_80';
          statusMessage = 'Warning: Spending is over 80% of budget limit';
        }

        return {
          ...budget,
          spent,
          remaining,
          percentageUsed,
          status,
          statusMessage,
          isExceeded: spent > budget.limit,
          isWarning: percentageUsed >= 80 && spent <= budget.limit,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedBudgets.length,
      data: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get budget for current or specific month
// @route   GET /api/budgets/current
// @access  Public
export const getCurrentBudget = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    let budget = await Budget.findOne({ month, year, category: 'All' }).lean();

    const spent = await calculateMonthlySpending(month, year, 'All');

    if (!budget) {
      return res.status(200).json({
        success: true,
        data: null,
        meta: {
          month,
          year,
          spent,
          message: 'No budget configured for this month',
        },
      });
    }

    const remaining = Math.round((budget.limit - spent) * 100) / 100;
    const percentageUsed = budget.limit > 0 ? Math.round((spent / budget.limit) * 1000) / 10 : 0;

    let status = 'normal';
    let statusMessage = 'On track';
    if (spent > budget.limit) {
      status = 'exceeded';
      statusMessage = `Budget exceeded by $${(spent - budget.limit).toFixed(2)}`;
    } else if (percentageUsed >= 80) {
      status = 'warning_80';
      statusMessage = 'Warning: You have reached 80% or more of your monthly spending limit';
    }

    res.status(200).json({
      success: true,
      data: {
        ...budget,
        spent,
        remaining,
        percentageUsed,
        status,
        statusMessage,
        isExceeded: spent > budget.limit,
        isWarning: percentageUsed >= 80 && spent <= budget.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or upsert budget limit
// @route   POST /api/budgets
// @access  Public
export const setBudget = async (req, res, next) => {
  try {
    const { month, year, limit, category = 'All', notes = '' } = req.body;

    const parsedMonth = Number(month);
    const parsedYear = Number(year);
    const parsedLimit = Number(limit);

    // Upsert budget for the month/year
    const budget = await Budget.findOneAndUpdate(
      { month: parsedMonth, year: parsedYear, category: category.trim() },
      {
        month: parsedMonth,
        year: parsedYear,
        limit: parsedLimit,
        category: category.trim(),
        notes: notes.trim(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    const spent = await calculateMonthlySpending(parsedMonth, parsedYear, category.trim());
    const remaining = Math.round((budget.limit - spent) * 100) / 100;
    const percentageUsed = budget.limit > 0 ? Math.round((spent / budget.limit) * 1000) / 10 : 0;

    res.status(201).json({
      success: true,
      message: 'Budget limit set successfully',
      data: {
        ...budget.toObject(),
        spent,
        remaining,
        percentageUsed,
        isExceeded: spent > budget.limit,
        isWarning: percentageUsed >= 80 && spent <= budget.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget by ID
// @route   PUT /api/budgets/:id
// @access  Public
export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format',
      });
    }

    const { limit, notes, category } = req.body;

    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found with id of ${id}`,
      });
    }

    if (limit !== undefined) budget.limit = Number(limit);
    if (notes !== undefined) budget.notes = notes.trim();
    if (category) budget.category = category.trim();

    await budget.save();

    const spent = await calculateMonthlySpending(budget.month, budget.year, budget.category);
    const remaining = Math.round((budget.limit - spent) * 100) / 100;
    const percentageUsed = budget.limit > 0 ? Math.round((spent / budget.limit) * 1000) / 10 : 0;

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        ...budget.toObject(),
        spent,
        remaining,
        percentageUsed,
        isExceeded: spent > budget.limit,
        isWarning: percentageUsed >= 80 && spent <= budget.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget by ID
// @route   DELETE /api/budgets/:id
// @access  Public
export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format',
      });
    }

    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: `Budget not found with id of ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget removed successfully',
      data: { id: budget._id },
    });
  } catch (error) {
    next(error);
  }
};
