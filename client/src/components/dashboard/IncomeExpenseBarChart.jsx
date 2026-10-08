import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { HiOutlineChartBarSquare } from 'react-icons/hi2';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === 'income')?.value || 0;
    const expense = payload.find((p) => p.dataKey === 'expense')?.value || 0;
    const savings = income - expense;

    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-bold text-slate-200 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Income:
            </span>
            <span className="font-bold">{formatCurrency(income)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Expense:
            </span>
            <span className="font-bold">{formatCurrency(expense)}</span>
          </div>
          <div className="pt-2 mt-1 border-t border-slate-700/80 flex items-center justify-between gap-4">
            <span className="text-slate-400">Net Flow:</span>
            <span
              className={`font-bold ${
                savings >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(savings)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const IncomeExpenseBarChart = ({ monthlyTrends = [] }) => {
  const hasData = monthlyTrends.some((m) => m.income > 0 || m.expense > 0);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Cash Flow Dynamics
            </h3>
            <p className="text-xs text-slate-500">Monthly income versus expenses comparison</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <span className="text-slate-600 font-medium">Expense</span>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <HiOutlineChartBarSquare className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No monthly cash flow records</p>
            <p className="text-xs text-slate-400 max-w-xs mt-0.5">
              Monthly trends will appear here once you record income and expense activities.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyTrends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="monthLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#f3731c"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export default IncomeExpenseBarChart;
