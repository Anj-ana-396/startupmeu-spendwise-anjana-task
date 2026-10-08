import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_CONFIG } from '../../utils/constants';

const CategoryBreakdownTable = ({ categories = [], grandTotal = 0 }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Detailed Category Analysis
          </h3>
          <p className="text-xs text-slate-500">
            Granular spending breakdown, frequency, and relative share
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
          Total: {formatCurrency(grandTotal)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Transactions</th>
              <th className="py-3 px-4">Average</th>
              <th className="py-3 px-4 text-right">Total Spent</th>
              <th className="py-3 px-4 w-1/4">Share (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((item) => {
              const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Other;

              return (
                <tr key={item.category} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <span>{item.category}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                    {item.count} orders
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                    {formatCurrency(item.avgAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(item.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: config.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-10 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CategoryBreakdownTable;
