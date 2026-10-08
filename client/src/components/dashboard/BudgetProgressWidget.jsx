import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import {
  HiOutlineBanknotes,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiPencilSquare,
  HiPlus,
} from 'react-icons/hi2';

const BudgetProgressWidget = ({ budget, onOpenSetBudget }) => {
  const hasBudget = budget && budget.limit > 0;
  const spent = budget?.spent || 0;
  const limit = budget?.limit || 0;
  const remaining = budget ? budget.remaining : 0;
  const percentage = budget?.percentageUsed || 0;
  const isExceeded = budget?.isExceeded || spent > limit;
  const isWarning = budget?.isWarning || (percentage >= 80 && !isExceeded);

  // Progress Bar styling & color
  const getProgressColor = () => {
    if (isExceeded) return 'bg-rose-500';
    if (isWarning) return 'bg-amber-500';
    if (percentage > 60) return 'bg-brand-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-600">
            <HiOutlineBanknotes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly Budget Guardrail
            </h3>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Target
            </p>
          </div>
        </div>

        <Button
          onClick={onOpenSetBudget}
          variant="secondary"
          size="sm"
          icon={hasBudget ? HiPencilSquare : HiPlus}
        >
          {hasBudget ? 'Edit Limit' : 'Set Budget'}
        </Button>
      </div>

      {!hasBudget ? (
        <div className="py-4 text-center space-y-2">
          <p className="text-sm text-slate-600 font-medium">
            No monthly spending limit set for this month.
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Setting a budget gives you real-time notifications when spending nears 80% or exceeds your goal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status Alert Banner */}
          {isExceeded && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs">
              <HiOutlineExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Budget Exceeded:</span> You have overspent by{' '}
                <span className="font-bold">{formatCurrency(spent - limit)}</span> this month.
              </div>
            </div>
          )}

          {isWarning && !isExceeded && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-800 text-xs">
              <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <span className="font-bold">Budget Alert:</span> You have utilized {percentage}% of your monthly limit.
              </div>
            </div>
          )}

          {!isWarning && !isExceeded && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs">
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1 font-medium">
                Spending is healthy — {percentage}% of limit used with{' '}
                <span className="font-bold">{formatCurrency(remaining)}</span> remaining.
              </div>
            </div>
          )}

          {/* Progress Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-600">
                Spent: <strong className="text-slate-900">{formatCurrency(spent)}</strong>
              </span>
              <span className="font-medium text-slate-600">
                Limit: <strong className="text-slate-900">{formatCurrency(limit)}</strong>
              </span>
            </div>

            {/* Track */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
                style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-500">
                Remaining:{' '}
                <span
                  className={`font-bold ${
                    remaining < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(remaining)}
                </span>
              </span>
              <Badge
                variant={isExceeded ? 'expense' : isWarning ? 'warning' : 'income'}
                size="sm"
                dot
              >
                {percentage}% used
              </Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BudgetProgressWidget;
