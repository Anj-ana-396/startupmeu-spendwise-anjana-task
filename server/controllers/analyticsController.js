import Transaction, { EXPENSE_CATEGORIES } from '../models/Transaction.js';

// @desc    Get dashboard summary metrics (total income, expense, balance, monthly figures)
// @route   GET /api/analytics/summary
// @access  Public
export const getSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Current month date boundaries
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Previous month date boundaries
    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Aggregate all-time income and expenses
    const allTimeStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalCount = 0;

    allTimeStats.forEach((stat) => {
      if (stat._id === 'income') totalIncome = Math.round(stat.total * 100) / 100;
      if (stat._id === 'expense') totalExpense = Math.round(stat.total * 100) / 100;
      totalCount += stat.count;
    });

    const netBalance = Math.round((totalIncome - totalExpense) * 100) / 100;

    // Aggregate current month income and expenses
    const currentMonthStats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    let currentMonthCount = 0;

    currentMonthStats.forEach((stat) => {
      if (stat._id === 'income') currentMonthIncome = Math.round(stat.total * 100) / 100;
      if (stat._id === 'expense') currentMonthExpense = Math.round(stat.total * 100) / 100;
      currentMonthCount += stat.count;
    });

    const currentMonthBalance = Math.round((currentMonthIncome - currentMonthExpense) * 100) / 100;

    // Aggregate previous month for percentage comparisons
    const prevMonthStats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevMonthIncome = 0;
    let prevMonthExpense = 0;

    prevMonthStats.forEach((stat) => {
      if (stat._id === 'income') prevMonthIncome = Math.round(stat.total * 100) / 100;
      if (stat._id === 'expense') prevMonthExpense = Math.round(stat.total * 100) / 100;
    });

    // Compute month-over-month growth %
    const incomeGrowth = prevMonthIncome > 0
      ? Math.round(((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 1000) / 10
      : null;

    const expenseGrowth = prevMonthExpense > 0
      ? Math.round(((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 1000) / 10
      : null;

    // Savings rate (% of income saved this month)
    const savingsRate = currentMonthIncome > 0
      ? Math.max(0, Math.round(((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 1000) / 10)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        allTime: {
          totalIncome,
          totalExpense,
          netBalance,
          totalCount,
        },
        currentMonth: {
          year: currentYear,
          month: currentMonth + 1,
          monthName: now.toLocaleString('default', { month: 'long' }),
          income: currentMonthIncome,
          expense: currentMonthExpense,
          balance: currentMonthBalance,
          savingsRate,
          transactionCount: currentMonthCount,
        },
        comparison: {
          prevMonthIncome,
          prevMonthExpense,
          incomeGrowth,
          expenseGrowth,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise breakdown of expenses/income
// @route   GET /api/analytics/categories
// @access  Public
export const getCategoriesBreakdown = async (req, res, next) => {
  try {
    const { type = 'expense', month, year, startDate, endDate } = req.query;

    const matchQuery = {
      type: type.toLowerCase() === 'income' ? 'income' : 'expense',
    };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchQuery.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.date.$lte = end;
      }
    } else if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      matchQuery.date = {
        $gte: new Date(y, m - 1, 1),
        $lte: new Date(y, m, 0, 23, 59, 59, 999),
      };
    }

    const categoryStats = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const grandTotal = categoryStats.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const categoriesWithPercentage = categoryStats.map((item) => {
      const roundedTotal = Math.round(item.totalAmount * 100) / 100;
      const percentage = grandTotal > 0 ? Math.round((roundedTotal / grandTotal) * 1000) / 10 : 0;
      return {
        category: item._id,
        totalAmount: roundedTotal,
        count: item.count,
        avgAmount: Math.round(item.avgAmount * 100) / 100,
        percentage,
      };
    });

    res.status(200).json({
      success: true,
      type: matchQuery.type,
      grandTotal: Math.round(grandTotal * 100) / 100,
      data: categoriesWithPercentage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly income vs expense historical trends
// @route   GET /api/analytics/monthly
// @access  Public
export const getMonthlyTrends = async (req, res, next) => {
  try {
    const monthsLimit = parseInt(req.query.months, 10) || 6;
    const now = new Date();

    // Calculate start date going back N months
    const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsLimit - 1), 1);

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Build ordered timeline array of the last `monthsLimit` months
    const trendMap = new Map();

    for (let i = monthsLimit - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthShort = d.toLocaleString('default', { month: 'short' });
      const key = `${year}-${String(month).padStart(2, '0')}`;

      trendMap.set(key, {
        key,
        year,
        month,
        monthLabel: `${monthShort} ${year}`,
        income: 0,
        expense: 0,
        netSavings: 0,
        transactionCount: 0,
      });
    }

    monthlyData.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      if (trendMap.has(key)) {
        const entry = trendMap.get(key);
        const rounded = Math.round(item.total * 100) / 100;
        if (item._id.type === 'income') {
          entry.income = rounded;
        } else if (item._id.type === 'expense') {
          entry.expense = rounded;
        }
        entry.transactionCount += item.count;
        entry.netSavings = Math.round((entry.income - entry.expense) * 100) / 100;
      }
    });

    const result = Array.from(trendMap.values());

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
