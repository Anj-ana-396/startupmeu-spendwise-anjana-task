import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Input, Select } from '../common/Input';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { HiCheck, HiOutlineBanknotes } from 'react-icons/hi2';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SetBudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const toast = useToast();
  const now = new Date();

  const [formData, setFormData] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    limit: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        month: initialData.month || now.getMonth() + 1,
        year: initialData.year || now.getFullYear(),
        limit: initialData.limit !== undefined ? String(initialData.limit) : '',
        notes: initialData.notes || '',
      });
      setErrors({});
    } else {
      setFormData({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        limit: '',
        notes: '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    const limitNum = parseFloat(formData.limit);
    if (!formData.limit || isNaN(limitNum) || limitNum <= 0) {
      errs.limit = 'Budget limit must be a positive number greater than zero';
    }
    if (!formData.month || formData.month < 1 || formData.month > 12) {
      errs.month = 'Valid month is required';
    }
    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      errs.year = 'Valid year (2000-2100) is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        month: Number(formData.month),
        year: Number(formData.year),
        limit: Number(formData.limit),
        notes: formData.notes.trim(),
        category: 'All',
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to configure budget');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Update Spending Budget' : 'Set Monthly Budget'}
      subtitle="Establish spending guardrails to stay disciplined with your capital."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Month"
            required
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
            options={MONTH_NAMES.map((name, index) => ({
              value: index + 1,
              label: name,
            }))}
            error={errors.month}
          />

          <Input
            label="Year"
            type="number"
            required
            min="2020"
            max="2035"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            error={errors.year}
          />
        </div>

        <Input
          label="Spending Limit ($ USD)"
          required
          type="number"
          step="0.01"
          min="1"
          prefix="$"
          placeholder="e.g. 2500.00"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          error={errors.limit}
          helperText="Maximum expense goal you intend not to exceed this month."
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Notes / Intent (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Vacation saving month, tight grocery discipline..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
          />
        </div>

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
            icon={HiCheck}
          >
            Save Target Limit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SetBudgetModal;
