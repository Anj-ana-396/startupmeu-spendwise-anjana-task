import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../models/Transaction.js';

export const validateTransactionInput = (req, res, next) => {
  const { title, amount, type, category, date } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Title is required and must be at least 2 characters long' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  const parsedAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push({ field: 'amount', message: 'Amount is required and must be a positive number greater than zero' });
  }

  if (!type || !['income', 'expense'].includes(type.toLowerCase())) {
    errors.push({ field: 'type', message: 'Type is required and must be either "income" or "expense"' });
  }

  const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  if (!category || !validCategories.includes(category)) {
    errors.push({
      field: 'category',
      message: `Invalid category for ${type || 'transaction'}. Allowed categories: ${validCategories.join(', ')}`,
    });
  }

  if (date && isNaN(new Date(date).getTime())) {
    errors.push({ field: 'date', message: 'Invalid date format' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateBudgetInput = (req, res, next) => {
  const { month, year, limit } = req.body;
  const errors = [];

  const parsedMonth = Number(month);
  if (!month || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    errors.push({ field: 'month', message: 'Month is required and must be an integer between 1 and 12' });
  }

  const parsedYear = Number(year);
  if (!year || isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
    errors.push({ field: 'year', message: 'Year is required and must be a valid 4-digit year (2000-2100)' });
  }

  const parsedLimit = Number(limit);
  if (limit === undefined || isNaN(parsedLimit) || parsedLimit <= 0) {
    errors.push({ field: 'limit', message: 'Budget limit is required and must be greater than zero' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
