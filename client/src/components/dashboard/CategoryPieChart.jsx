import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_CONFIG } from '../../utils/constants';
import { HiOutlineChartPie } from 'react-icons/hi2';

const PALETTE = [
  '#f3731c', // brand tan-hide
  '#f79f58', // tan-hide light
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
  '#64748b', // slate
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.fillColor }}
          />
          <span className="font-semibold text-slate-200">{data.name}</span>
        </div>
        <p className="text-sm font-bold text-white">{formatCurrency(data.value)}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {data.percentage}% of total expenses ({data.count} transactions)
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ categories = [], grandTotal = 0 }) => {
  const chartData = categories.map((item, index) => {
    const color = CATEGORY_CONFIG[item.category]?.color || PALETTE[index % PALETTE.length];
    return {
      name: item.category,
      value: item.totalAmount,
      percentage: item.percentage,
      count: item.count,
      fillColor: color,
    };
  });

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Spending Breakdown
            </h3>
            <p className="text-xs text-slate-500">Distribution by expense category</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Total: {formatCurrency(grandTotal)}
          </span>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <HiOutlineChartPie className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No expense data to display</p>
            <p className="text-xs text-slate-400 max-w-xs mt-0.5">
              Add your first expense transaction to view category insights.
            </p>
          </div>
        ) : (
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fillColor}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Expenses
              </span>
              <span className="text-lg font-black text-slate-900">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend list */}
      {chartData.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          {chartData.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center justify-between pr-2">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.fillColor }}
                />
                <span className="truncate text-slate-600 font-medium">
                  {item.name}
                </span>
              </div>
              <span className="font-semibold text-slate-900 shrink-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CategoryPieChart;
