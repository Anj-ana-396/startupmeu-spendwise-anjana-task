import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Input, Select } from '../common/Input';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';
import {
  HiOutlineBanknotes,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiPlus,
  HiCheck,
} from 'react-icons/hi2';

const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const toast = useToast();
  const isEditing = Boolean(initialData?._id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        type: initialData.type || 'expense',
        category: initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: EXPENSE_CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleTypeChange = (newType) => {
    const defaultCat = newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCat,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Amount must be greater than zero';
    }

    if (!formData.category) {
      errs.category = 'Category is required';
    }

    if (!formData.date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save transaction');
    }
  };

  const currentCategories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      subtitle={
        isEditing
          ? 'Update the details for this transaction record.'
          : 'Record a new income or expense in your ledger.'
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle Tabs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                formData.type === 'expense'
                  ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                formData.type === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Title */}
        <Input
          label="Title"
          required
          placeholder="e.g. Whole Foods Groceries, Client Retainer"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />

        {/* Amount & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount ($ USD)"
            required
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            prefix="$"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
          />

          <Input
            label="Date"
            required
            type="date"
            icon={HiOutlineCalendar}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
          />
        </div>

        {/* Category */}
        <Select
          label="Category"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={currentCategories.map((c) => ({ value: c, label: c }))}
          error={errors.category}
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add any helpful context, notes or reference..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            loading={isSubmitting}
            icon={isEditing ? HiCheck : HiPlus}
          >
            {isEditing ? 'Save Changes' : 'Create Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
