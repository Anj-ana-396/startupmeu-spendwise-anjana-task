import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '../components/dashboard/StatCard';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import IncomeExpenseBarChart from '../components/dashboard/IncomeExpenseBarChart';
import BudgetProgressWidget from '../components/dashboard/BudgetProgressWidget';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';
import analyticsService from '../services/analyticsService';
import budgetService from '../services/budgetService';
import transactionService from '../services/transactionService';
import {
  MOCK_SUMMARY,
  MOCK_CATEGORIES,
  MOCK_MONTHLY_TRENDS,
  MOCK_CURRENT_BUDGET,
  MOCK_TRANSACTIONS,
} from '../utils/mockData';
import {
  HiOutlineBanknotes,
  HiOutlineScale,
  HiOutlineArrowTrendingUp,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';

const DashboardPage = ({
  onNavigateToTransactions,
  onOpenAddTransaction,
  onOpenSetBudget,
}) => {
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [grandCategoryTotal, setGrandCategoryTotal] = useState(3120.40);
  const [monthlyTrends, setMonthlyTrends] = useState(MOCK_MONTHLY_TRENDS);
  const [currentBudget, setCurrentBudget] = useState(MOCK_CURRENT_BUDGET);
  const [recentTransactions, setRecentTransactions] = useState(MOCK_TRANSACTIONS);

  const fetchData = useCallback(async () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [
        summaryRes,
        categoriesRes,
        trendsRes,
        budgetRes,
        transactionsRes,
      ] = await Promise.all([
        analyticsService.getSummary().catch(() => null),
        analyticsService.getCategories({ type: 'expense' }).catch(() => null),
        analyticsService.getMonthlyTrends(6).catch(() => null),
        budgetService.getCurrent(currentMonth, currentYear).catch(() => null),
        transactionService.getAll({ page: 1, limit: 5, sortBy: 'date', sortOrder: 'desc' }).catch(() => null),
      ]);

      if (summaryRes?.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (categoriesRes?.success && categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data);
        setGrandCategoryTotal(categoriesRes.grandTotal || 0);
      }
      if (trendsRes?.success && trendsRes.data && trendsRes.data.length > 0) {
        setMonthlyTrends(trendsRes.data);
      }
      if (budgetRes?.success && budgetRes.data) {
        setCurrentBudget(budgetRes.data);
      }
      if (transactionsRes?.success && transactionsRes.data && transactionsRes.data.length > 0) {
        setRecentTransactions(transactionsRes.data);
      }
    } catch (err) {
      console.log('Dashboard using raw fallback data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allTime = summary?.allTime || MOCK_SUMMARY.allTime;
  const currentMonth = summary?.currentMonth || MOCK_SUMMARY.currentMonth;
  const comparison = summary?.comparison || MOCK_SUMMARY.comparison;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Financial Health at a Glance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time cash flow, category breakdowns, and spending guardrails
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Income"
          amount={allTime.totalIncome || 0}
          trend={comparison.incomeGrowth}
          trendLabel="vs last month"
          icon={HiOutlineBanknotes}
          colorScheme="income"
        />

        <StatCard
          title="Total Expenses"
          amount={allTime.totalExpense || 0}
          trend={comparison.expenseGrowth}
          trendLabel="vs last month"
          icon={HiOutlineScale}
          colorScheme="expense"
        />

        <StatCard
          title="Current Net Balance"
          amount={allTime.netBalance || 0}
          subtitle="Total Income minus Total Expenses"
          icon={HiOutlineArrowTrendingUp}
          colorScheme="brand"
        />

        <StatCard
          title="Current Month Spent"
          amount={currentMonth.expense || 0}
          subtitle={`${currentMonth.monthName || 'Current'} Activity`}
          icon={HiOutlineCalendarDays}
          colorScheme="purple"
        />
      </div>

      {/* Budget Guardrail Widget */}
      <BudgetProgressWidget
        budget={currentBudget}
        onOpenSetBudget={onOpenSetBudget}
      />

      {/* 2 Main Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart
          categories={categories}
          grandTotal={grandCategoryTotal}
        />
        <IncomeExpenseBarChart monthlyTrends={monthlyTrends} />
      </div>

      {/* Recent Activity List */}
      <RecentTransactionsList
        transactions={recentTransactions}
        onViewAll={onNavigateToTransactions}
        onEditTransaction={() => onNavigateToTransactions()}
        onDeleteTransaction={() => onNavigateToTransactions()}
      />
    </div>
  );
};

export default DashboardPage;
