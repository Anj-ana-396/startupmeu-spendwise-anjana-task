import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: [true, 'Month is required (1-12)'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or greater'],
      max: [2100, 'Year cannot exceed 2100'],
    },
    limit: {
      type: Number,
      required: [true, 'Monthly spending limit is required'],
      min: [1, 'Spending limit must be greater than zero'],
      set: (val) => Math.round(Number(val) * 100) / 100,
    },
    category: {
      type: String,
      default: 'All',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budgets for the same month/year/category
budgetSchema.index({ month: 1, year: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
