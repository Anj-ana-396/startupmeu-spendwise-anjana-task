import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

// @desc    Get all transactions with filtering, searching, sorting & pagination
// @route   GET /api/transactions
// @access  Public
export const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Filter by type (income | expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Search query on title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Sorting
    const sortField = ['date', 'amount', 'title', 'createdAt'].includes(sortBy) ? sortBy : 'date';
    const order = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: order };

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNumber - 1) * limitNumber;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber) || 1;

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Public
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format',
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id of ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type: type.toLowerCase(),
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing transaction
// @route   PUT /api/transactions/:id
// @access  Public
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format',
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id of ${id}`,
      });
    }

    const { title, amount, type, category, date, description } = req.body;

    if (title) transaction.title = title.trim();
    if (amount !== undefined) transaction.amount = Number(amount);
    if (type) transaction.type = type.toLowerCase();
    if (category) transaction.category = category.trim();
    if (date) transaction.date = new Date(date);
    if (description !== undefined) transaction.description = description.trim();

    const updatedTransaction = await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format',
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with id of ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id: transaction._id },
    });
  } catch (error) {
    next(error);
  }
};
