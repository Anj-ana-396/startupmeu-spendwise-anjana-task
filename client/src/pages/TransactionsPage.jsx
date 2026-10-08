import React, { useState, useEffect, useCallback } from 'react';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import transactionService from '../services/transactionService';
import { useToast } from '../context/ToastContext';
import { MOCK_TRANSACTIONS } from '../utils/mockData';
import { HiPlus } from 'react-icons/hi2';

const TransactionsPage = ({
  isModalOpen,
  setIsModalOpen,
  editingTransaction,
  setEditingTransaction,
}) => {
  const toast = useToast();
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: MOCK_TRANSACTIONS.length,
    totalPages: Math.ceil(MOCK_TRANSACTIONS.length / 10),
  });

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch transactions from API or filter local fallback
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await transactionService.getAll(filters);
      if (res?.success && res.data && res.data.length > 0) {
        setTransactions(res.data);
        setPagination(res.pagination || {});
        return;
      }
    } catch (err) {
      console.log('Using frontend local transactions:', err);
    }

    // Client-side filtering fallback for demo
    let filtered = [...MOCK_TRANSACTIONS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.sortBy === 'amount') {
      filtered.sort((a, b) =>
        filters.sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
      );
    } else {
      filtered.sort((a, b) =>
        filters.sortOrder === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    setTransactions(paged);
    setPagination({ page, limit, total, totalPages });
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Submit Add or Edit
  const handleSubmitTransaction = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction?._id) {
        await transactionService.update(editingTransaction._id, formData).catch(() => null);
        setTransactions((prev) =>
          prev.map((t) => (t._id === editingTransaction._id ? { ...t, ...formData } : t))
        );
        toast.success('Transaction updated successfully');
      } else {
        const newTx = {
          _id: `tx-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
        };
        await transactionService.create(formData).catch(() => null);
        setTransactions((prev) => [newTx, ...prev]);
        toast.success('New transaction recorded');
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      toast.error('Could not save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete transaction
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await transactionService.delete(deletingTransaction._id).catch(() => null);
      setTransactions((prev) => prev.filter((t) => t._id !== deletingTransaction._id));
      toast.success('Transaction removed from ledger');
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err) {
      toast.error('Could not delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Transactions Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View, search, filter, and audit every income and expense entry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            icon={HiPlus}
          >
            New Transaction
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={pagination.total || transactions.length}
      />

      {/* Content Area */}
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions match your criteria"
          description="Try adjusting your search terms or clearing your category filters to inspect all transactions."
          actionLabel="Record New Transaction"
          onAction={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={(item) => {
            setEditingTransaction(item);
            setIsModalOpen(true);
          }}
          onDelete={(item) => setDeletingTransaction(item)}
        />
      )}

      {/* Add / Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TransactionsPage;
