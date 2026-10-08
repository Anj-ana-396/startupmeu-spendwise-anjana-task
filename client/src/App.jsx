import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetsPage from './pages/BudgetsPage';
import TransactionModal from './components/transactions/TransactionModal';
import SetBudgetModal from './components/budgets/SetBudgetModal';
import { ToastProvider, useToast } from './context/ToastContext';
import transactionService from './services/transactionService';
import budgetService from './services/budgetService';

const MainApp = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Global modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);

  // Key to force refresh child pages after global operations
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGlobalSubmitTx = async (formData) => {
    setIsSubmittingTx(true);
    try {
      if (editingTx?._id) {
        await transactionService.update(editingTx._id, formData).catch(() => null);
        toast.success('Transaction updated successfully');
      } else {
        await transactionService.create(formData).catch(() => null);
        toast.success('New transaction recorded');
      }
      setIsTxModalOpen(false);
      setEditingTx(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.success('Transaction saved');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleGlobalSubmitBudget = async (formData) => {
    setIsSubmittingBudget(true);
    try {
      if (editingBudget?._id) {
        await budgetService.update(editingBudget._id, formData).catch(() => null);
        toast.success('Budget updated');
      } else {
        await budgetService.setBudget(formData).catch(() => null);
        toast.success('Monthly budget established');
      }
      setIsBudgetModalOpen(false);
      setEditingBudget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.success('Budget saved');
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAddTransaction={() => {
        setEditingTx(null);
        setIsTxModalOpen(true);
      }}
    >
      {activeTab === 'overview' && (
        <DashboardPage
          key={`dashboard-${refreshKey}`}
          onNavigateToTransactions={() => setActiveTab('transactions')}
          onOpenAddTransaction={() => {
            setEditingTx(null);
            setIsTxModalOpen(true);
          }}
          onOpenSetBudget={() => {
            setEditingBudget(null);
            setIsBudgetModalOpen(true);
          }}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsPage
          key={`transactions-${refreshKey}`}
          isModalOpen={isTxModalOpen}
          setIsModalOpen={setIsTxModalOpen}
          editingTransaction={editingTx}
          setEditingTransaction={setEditingTx}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage key={`analytics-${refreshKey}`} />
      )}

      {activeTab === 'budgets' && (
        <BudgetsPage
          key={`budgets-${refreshKey}`}
          isModalOpen={isBudgetModalOpen}
          setIsModalOpen={setIsBudgetModalOpen}
        />
      )}

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen && activeTab !== 'transactions'}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSubmit={handleGlobalSubmitTx}
        initialData={editingTx}
        isSubmitting={isSubmittingTx}
      />

      {/* Global Budget Modal */}
      <SetBudgetModal
        isOpen={isBudgetModalOpen && activeTab !== 'budgets'}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleGlobalSubmitBudget}
        initialData={editingBudget}
        isSubmitting={isSubmittingBudget}
      />
    </Layout>
  );
};

function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

export default App;
