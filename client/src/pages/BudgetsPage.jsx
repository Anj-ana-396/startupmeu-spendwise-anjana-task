import React, { useState, useEffect, useCallback } from 'react';
import BudgetCard from '../components/budgets/BudgetCard';
import SetBudgetModal from '../components/budgets/SetBudgetModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import budgetService from '../services/budgetService';
import { useToast } from '../context/ToastContext';
import { MOCK_BUDGETS_LIST } from '../utils/mockData';
import {
  HiPlus,
  HiOutlineBanknotes,
  HiOutlineLightBulb,
} from 'react-icons/hi2';

const BudgetsPage = ({ isModalOpen, setIsModalOpen }) => {
  const toast = useToast();
  const [budgets, setBudgets] = useState(MOCK_BUDGETS_LIST);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      const res = await budgetService.getAll();
      if (res?.success && res.data && res.data.length > 0) {
        setBudgets(res.data);
      }
    } catch (err) {
      console.log('Budgets using fallback raw data:', err);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmitBudget = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingBudget?._id) {
        await budgetService.update(editingBudget._id, formData).catch(() => null);
        setBudgets((prev) =>
          prev.map((b) => (b._id === editingBudget._id ? { ...b, ...formData } : b))
        );
        toast.success('Spending budget updated successfully');
      } else {
        const newBudget = {
          _id: `b-${Date.now()}`,
          ...formData,
          spent: 0,
          remaining: formData.limit,
          percentageUsed: 0,
          status: 'normal',
        };
        await budgetService.setBudget(formData).catch(() => null);
        setBudgets((prev) => [newBudget, ...prev]);
        toast.success('Monthly budget established');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error('Could not save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBudget) return;
    setIsDeleting(true);
    try {
      await budgetService.delete(deletingBudget._id).catch(() => null);
      setBudgets((prev) => prev.filter((b) => b._id !== deletingBudget._id));
      toast.success('Budget removed');
      setDeletingBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error('Could not delete budget');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Monthly Spending Budgets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Set discipline guardrails and monitor your expense burn rate in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            icon={HiPlus}
          >
            Set New Budget
          </Button>
        </div>
      </div>

      {/* Grid of Active Monthly Budgets */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={HiOutlineBanknotes}
          title="No Monthly Budgets Configured"
          description="Create a monthly budget limit to track live spending against your financial target."
          actionLabel="Set First Budget Limit"
          onAction={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <BudgetCard
              key={b._id}
              budget={b}
              onEdit={(item) => {
                setEditingBudget(item);
                setIsModalOpen(true);
              }}
              onDelete={(item) => setDeletingBudget(item)}
            />
          ))}
        </div>
      )}

      {/* Budget Guardrail Advice & Strategy Card */}
      <Card className="bg-gradient-to-r from-brand-50/70 via-white to-amber-50/70 border-brand-200/80 p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/25">
            <HiOutlineLightBulb className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-base">
              The 50 / 30 / 20 Budgeting Rule of Thumb
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              SpendWise recommends allocating 50% of monthly income to essential Needs (rent, bills, groceries), 30% to Wants (dining, entertainment, shopping), and 20% directly into Savings or Investments. SpendWise alerts you automatically whenever your expenses cross the 80% boundary.
            </p>
          </div>
        </div>
      </Card>

      {/* Set Budget Modal */}
      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSubmitBudget}
        initialData={editingBudget}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        transaction={
          deletingBudget
            ? {
                title: `Budget for Month ${deletingBudget.month}/${deletingBudget.year}`,
                amount: deletingBudget.limit,
                type: 'expense',
                category: deletingBudget.category,
                date: new Date(),
              }
            : null
        }
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default BudgetsPage;
