import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import {
  HiOutlineBanknotes,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const monthName = MONTH_NAMES[budget.month - 1] || `Month ${budget.month}`;
  const spent = budget.spent || 0;
  const limit = budget.limit || 0;
  const remaining = budget.remaining !== undefined ? budget.remaining : limit - spent;
  const percentage = budget.percentageUsed || 0;
  const isExceeded = budget.isExceeded || spent > limit;
  const isWarning = budget.isWarning || (percentage >= 80 && !isExceeded);

  const getProgressColor = () => {
    if (isExceeded) return 'bg-rose-500';
    if (isWarning) return 'bg-amber-500';
    if (percentage > 60) return 'bg-brand-500';
    return 'bg-emerald-500';
  };

  return (
    <Card hoverEffect className="relative overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-600">
            <HiOutlineBanknotes className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              {monthName} {budget.year}
            </h4>
            <p className="text-xs text-slate-500">
              {budget.category === 'All' ? 'Overall Spending Limit' : `${budget.category} Budget`}
            </p>
          </div>
        </div>

        <Badge
          variant={isExceeded ? 'expense' : isWarning ? 'warning' : 'income'}
          size="sm"
          dot
        >
          {isExceeded ? 'Exceeded' : isWarning ? 'Over 80%' : 'On Track'}
        </Badge>
      </div>

      {/* Alert Strip if exceeded or warning */}
      {isExceeded && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-center gap-2">
          <HiOutlineExclamationTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Exceeded target by <strong>{formatCurrency(spent - limit)}</strong></span>
        </div>
      )}

      {isWarning && !isExceeded && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-center gap-2">
          <HiOutlineExclamationTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Warning: <strong>{percentage}%</strong> of budget utilized</span>
        </div>
      )}

      {/* Progress Metric */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">
            Spent: <strong className="text-slate-900">{formatCurrency(spent)}</strong>
          </span>
          <span className="text-slate-500">
            Target: <strong className="text-slate-900">{formatCurrency(limit)}</strong>
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-500">
            Remaining:{' '}
            <strong
              className={remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}
            >
              {formatCurrency(remaining)}
            </strong>
          </span>
          <span className="font-bold text-slate-700">{percentage}%</span>
        </div>
      </div>

      {budget.notes && (
        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
          "{budget.notes}"
        </p>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onEdit(budget)}
          icon={HiOutlinePencilSquare}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(budget)}
          icon={HiOutlineTrash}
          className="text-rose-600 hover:bg-rose-50"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default BudgetCard;
