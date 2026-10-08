import React from 'react';
import { Input, Select } from '../common/Input';
import Button from '../common/Button';
import { ALL_CATEGORIES } from '../../utils/constants';
import {
  HiMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowPath,
} from 'react-icons/hi2';

const TransactionFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search Input */}
        <Input
          placeholder="Search by title, description..."
          icon={HiMagnifyingGlass}
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
        />

        {/* Type Filter */}
        <Select
          value={filters.type || ''}
          onChange={(e) => onFilterChange({ type: e.target.value, page: 1 })}
          options={[
            { value: '', label: 'All Transaction Types' },
            { value: 'expense', label: 'Expenses Only' },
            { value: 'income', label: 'Income Only' },
          ]}
        />

        {/* Category Filter */}
        <Select
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          options={[
            { value: '', label: 'All Categories' },
            ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
        />

        {/* Sort By Filter */}
        <Select
          value={`${filters.sortBy || 'date'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange({ sortBy, sortOrder, page: 1 });
          }}
          options={[
            { value: 'date-desc', label: 'Date: Newest First' },
            { value: 'date-asc', label: 'Date: Oldest First' },
            { value: 'amount-desc', label: 'Amount: High to Low' },
            { value: 'amount-asc', label: 'Amount: Low to High' },
          ]}
        />
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <HiOutlineFunnel className="w-4 h-4 text-brand-500" />
          <span>
            Showing <strong className="text-slate-900">{totalResults}</strong> filtered records
          </span>
        </div>

        {(filters.search || filters.type || filters.category || filters.startDate || filters.endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            icon={HiOutlineArrowPath}
            className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
          >
            Clear Active Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
