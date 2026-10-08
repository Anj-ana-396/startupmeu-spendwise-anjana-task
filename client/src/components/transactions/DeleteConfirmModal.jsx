import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiOutlineExclamationTriangle, HiOutlineTrash } from 'react-icons/hi2';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting = false,
}) => {
  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs">
          <HiOutlineExclamationTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <p>
            Are you sure you want to permanently delete this transaction? This action cannot be undone.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between font-semibold text-slate-800">
            <span>{transaction.title}</span>
            <span
              className={
                transaction.type === 'income'
                  ? 'text-emerald-600'
                  : 'text-slate-900'
              }
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Category: {transaction.category}</span>
            <span>Date: {formatDate(transaction.date)}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={isDeleting}
            icon={HiOutlineTrash}
          >
            Delete Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
