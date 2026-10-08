import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_CONFIG } from '../../utils/constants';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowUpRight,
  HiOutlineArrowDownLeft,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';

const TransactionTable = ({
  transactions = [],
  pagination = {},
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const { page = 1, totalPages = 1, total = 0 } = pagination;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Transaction</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((item) => {
              const isIncome = item.type === 'income';
              const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Other;

              return (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                            : 'bg-orange-50 text-brand-600 border border-brand-200/80'
                        }`}
                      >
                        {isIncome ? (
                          <HiOutlineArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <HiOutlineArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-slate-900 truncate">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-4 px-4">
                    <Badge
                      variant={isIncome ? 'income' : 'expense'}
                      size="sm"
                      dot
                    >
                      {item.type}
                    </Badge>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: catConfig.color }}
                      />
                      {item.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs font-medium text-slate-500">
                    {formatDate(item.date)}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`text-sm font-extrabold tracking-tight ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(item.amount)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                        title="Edit transaction"
                        aria-label="Edit transaction"
                      >
                        <HiOutlinePencilSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
        {transactions.map((item) => {
          const isIncome = item.type === 'income';
          return (
            <div
              key={item._id}
              className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-200/60 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(item.date)} • {item.category}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-extrabold ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </p>
                  <Badge variant={isIncome ? 'income' : 'expense'} size="sm">
                    {item.type}
                  </Badge>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/50">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(item)}
                  icon={HiOutlinePencilSquare}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item)}
                  icon={HiOutlineTrash}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <span>
            Page <strong className="text-slate-900">{page}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong> (Total {total}{' '}
            records)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 font-bold bg-brand-50 text-brand-700 border border-brand-200 rounded-lg">
              {page}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
