import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_CONFIG } from '../../utils/constants';
import {
  HiOutlineArrowUpRight,
  HiOutlineArrowDownLeft,
  HiOutlineChevronRight,
  HiOutlineReceiptPercent,
} from 'react-icons/hi2';

const RecentTransactionsList = ({
  transactions = [],
  onViewAll,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500">Latest activity across accounts</p>
          </div>
          {transactions.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <HiOutlineChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <HiOutlineReceiptPercent className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-medium text-slate-600">No transactions recorded yet</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
              Add your first transaction to view your recent cash flow history.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((t) => {
              const isIncome = t.type === 'income';
              const config = CATEGORY_CONFIG[t.category] || CATEGORY_CONFIG.Other;

              return (
                <div
                  key={t._id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                          : 'bg-orange-50 text-brand-600 border border-brand-200/80'
                      }`}
                    >
                      {isIncome ? (
                        <HiOutlineArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <HiOutlineArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">
                          {formatDate(t.date)}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-medium text-slate-600">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {t.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactionsList;
