import React from 'react';
import { HiOutlineReceiptRefund, HiPlus } from 'react-icons/hi2';
import Button from './Button';

const EmptyState = ({
  icon: Icon = HiOutlineReceiptRefund,
  title = 'No transactions found',
  description = 'You haven’t added any transactions for this period or filter. Start tracking your cash flow now.',
  actionLabel = 'Add First Transaction',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white/70 border border-dashed border-slate-300/80 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-6">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} icon={HiPlus} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
