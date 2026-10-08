import mongoose from 'mongoose';

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      set: (val) => Math.round(Number(val) * 100) / 100, // standard 2 decimal precision
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      validate: {
        validator: function (val) {
          if (this.type === 'income') {
            return INCOME_CATEGORIES.includes(val);
          }
          if (this.type === 'expense') {
            return EXPENSE_CATEGORIES.includes(val);
          }
          return ALL_CATEGORIES.includes(val);
        },
        message: (props) => `"${props.value}" is not a valid category for the selected transaction type`,
      },
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high performance querying
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ title: 'text', description: 'text' });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
