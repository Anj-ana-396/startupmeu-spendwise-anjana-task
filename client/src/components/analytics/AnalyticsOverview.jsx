import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import {
  HiOutlineBanknotes,
  HiOutlineScale,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const AnalyticsOverview = ({ summary, categories = [] }) => {
  const allTime = summary?.allTime || {};
  const currentMonth = summary?.currentMonth || {};

  const totalIncome = allTime.totalIncome || 0;
  const totalExpense = allTime.totalExpense || 0;
  const netSavings = allTime.netBalance || 0;

  // Overall savings rate
  const overallSavingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 1000) / 10)
      : 0;

  // Top spending category
  const topCategory = categories.length > 0 ? categories[0] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card padding="p-5" hoverEffect>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            All-Time Inflow
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HiOutlineBanknotes className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(totalIncome)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Cumulative earned income</p>
      </Card>

      <Card padding="p-5" hoverEffect>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            All-Time Outflow
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <HiOutlineScale className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(totalExpense)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Cumulative settled expenses</p>
      </Card>

      <Card padding="p-5" hoverEffect>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Savings Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <HiOutlineArrowTrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-brand-600 tracking-tight">
          {overallSavingsRate}%
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {formatCurrency(netSavings)} retained capital
        </p>
      </Card>

      <Card padding="p-5" hoverEffect>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top Outflow Category
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <HiOutlineSparkles className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
          {topCategory ? topCategory.category : 'N/A'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {topCategory
            ? `${formatCurrency(topCategory.totalAmount)} (${topCategory.percentage}%)`
            : 'No expense records'}
        </p>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
