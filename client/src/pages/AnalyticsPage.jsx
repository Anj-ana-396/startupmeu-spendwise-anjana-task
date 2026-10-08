import React, { useState, useEffect, useCallback } from 'react';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';
import ExpenseTrendAreaChart from '../components/analytics/ExpenseTrendAreaChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import CategoryBreakdownTable from '../components/analytics/CategoryBreakdownTable';
import { Select } from '../components/common/Input';
import analyticsService from '../services/analyticsService';
import {
  MOCK_SUMMARY,
  MOCK_CATEGORIES,
  MOCK_MONTHLY_TRENDS,
} from '../utils/mockData';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [grandCategoryTotal, setGrandCategoryTotal] = useState(3120.40);
  const [monthlyTrends, setMonthlyTrends] = useState(MOCK_MONTHLY_TRENDS);
  const [trendRange, setTrendRange] = useState('6');
  const [categoryType, setCategoryType] = useState('expense');

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, categoriesRes, trendsRes] = await Promise.all([
        analyticsService.getSummary().catch(() => null),
        analyticsService.getCategories({ type: categoryType }).catch(() => null),
        analyticsService.getMonthlyTrends(Number(trendRange)).catch(() => null),
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
    } catch (err) {
      console.log('Analytics using fallback raw data:', err);
    }
  }, [categoryType, trendRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Financial Analytics & Insights
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Understand your capital distribution and spending trends
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Trend Period Selector */}
          <div className="w-36">
            <Select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value)}
              options={[
                { value: '3', label: 'Last 3 Months' },
                { value: '6', label: 'Last 6 Months' },
                { value: '12', label: 'Last 12 Months' },
              ]}
            />
          </div>

          {/* Type Filter */}
          <div className="w-40">
            <Select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              options={[
                { value: 'expense', label: 'Expenses View' },
                { value: 'income', label: 'Income View' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* High-level Overview Cards */}
      <AnalyticsOverview summary={summary} categories={categories} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart
          categories={categories}
          grandTotal={grandCategoryTotal}
        />
        <ExpenseTrendAreaChart monthlyData={monthlyTrends} />
      </div>

      {/* Detailed Category Breakdown Table */}
      {categories.length > 0 && (
        <CategoryBreakdownTable
          categories={categories}
          grandTotal={grandCategoryTotal}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;
