# SpendWise — Full-Stack Expense Tracker (MERN)

SpendWise is a full-stack personal finance and expense tracking web application engineered with the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js) and styled with Tailwind CSS.

---

<img width="1920" height="1200" alt="Screenshot (347)" src="https://github.com/user-attachments/assets/4b7c1c9d-6fca-4822-b5c1-f65a5f599a42" />

---

## Features

### 1. Executive Financial Dashboard
- **Live Summary Metrics**: Displays Net Balance (`Total Income - Total Expenses`), Total Inflow (Income), Total Outflow (Expenses), and Current Month Expenses with month-over-month comparisons.
- **Spending Breakdown Donut Chart**: Interactive Recharts Donut chart showing category-wise expense distribution and proportional share.
- **Cash Flow Dynamics Bar Chart**: Side-by-side monthly Income versus Expense comparison.
- **Monthly Budget Progress Indicator**: Dynamic progress meter that tracks monthly spend against a set limit with an **80% threshold warning** and an **over-budget alert**.
- **Recent Transactions Ledger**: Quick chronological activity feed displaying the latest transactions with category icons and direct navigation.

### 2. Transaction Management (CRUD)
- **Create Transactions**: Add income or expense entries with Title, Amount, Type, Category, Date, and Description.
- **Edit & Update**: Edit any transaction in place via a clean modal dialog.
- **Delete with Confirmation**: Safe delete confirmation dialog to prevent accidental removals.
- **Search & Multi-Filter**: Search by title, description, or category; filter by type (`Income` / `Expense`), category, and date.
- **Sorting & Pagination**: Sort by Date (Newest/Oldest) or Amount (High to Low / Low to High) with paginated navigation.
- **Financial Precision**: Numeric amounts rounded to 2 decimal places to avoid floating-point inaccuracies.

---
  
  <img width="1920" height="1200" alt="Screenshot (352)" src="https://github.com/user-attachments/assets/ad06e03a-c63e-4fc2-a513-53ca5c8b6e93" />

---

### 3. Monthly Budgeting
- Set custom monthly spending limits persisted directly in MongoDB.
- Live calculation of spent and remaining budget.
- Automatic visual warning when spending crosses 80% of the set limit.
- High-priority alert banner when the budget is exceeded.

---
  <img width="1920" height="1200" alt="Screenshot (350)" src="https://github.com/user-attachments/assets/1437b03b-d12c-44a1-9876-1890a4f12402" />

---
### 4. Analytics & Insights
- Category-wise expense and income breakdown.
- Monthly expense and income velocity area chart.
- Granular breakdown table with transaction counts, average order values, and share percentages.
- Timeline selector for 3, 6, and 12-month views.

 ---

  <img width="1920" height="1200" alt="Screenshot (349)" src="https://github.com/user-attachments/assets/1c5c476e-40b0-4f15-9105-fc8a370a7c9e" />

  ---

### 5. Polished User Interface & Design
- **Custom Tan-Hide Color Palette**: Modern warm ochre tones (`#fff7ed` to `#411509`).
- **Typography**: Google Fonts **Plus Jakarta Sans**.
- **Vector Icons**: Lightweight modular icons from `react-icons/hi2`.
- **Toast Notifications**: Built-in floating notifications for instant feedback on create, edit, and delete operations.
- **Responsive Layout**: Desktop sidebar navigation and mobile collapsible drawer.

---

## Technologies Used

- **Frontend**: React.js 19 with Vite, Tailwind CSS, Axios
- **Charts**: Recharts
- **Icons**: React Icons
- **Backend**: Node.js, Express.js, Morgan, CORS, Dotenv
- **Database**: MongoDB with Mongoose ODM
- **Development & Process**: Kiro 

---

## Setup and Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.x or higher)


### 1. Clone or Open the Workspace
```bash
git clone https://github.com/Anj-ana-396/startupmeu-spendwise-anjana-task
```

### 2. Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install

```

#### Install Frontend Dependencies:
```bash
cd client
npm install

```



---

## How to Run the Application

The backend and frontend are designed to run **separately** in two distinct terminal windows.

### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```

### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```


---

## AI Development Tool Used

This project was developed using **Kiro** as the AI-assisted development tool.

---

## AI Development Experience

Using Kiro significantly accelerated the full-stack workflow, allowing high architectural consistency between the Express REST API contracts and the React frontend components. The AI helped quickly generate boilerplate, write complex MongoDB aggregation pipelines for dashboard metrics, and implement Stripe-inspired design components with precision.

### Specific Tasks Where the AI Tool Was Used:

1. **Architecture & Scaffolding**:
   Structured the clean MERN project layout separating models, controllers, routes, and middleware on the backend, alongside modular React component hierarchies on the frontend.

2. **MongoDB Aggregation Pipelines & API Creation**:
   Constructed MongoDB aggregation pipelines for `/api/analytics/summary`, `/api/analytics/categories`, and `/api/analytics/monthly` to dynamically calculate net balances, category spending percentages, and month-over-month growth.

3. **React Component Development & Design System**:
   Implemented modular, reusable UI components (`Card`, `Button`, `Input`, `Select`, `Modal`, `Badge`, `Skeleton`, `EmptyState`) and integrated Tailwind CSS with the custom Tan-Hide palette and `react-icons`.

4. **Budget Guardrail & Threshold Logic**:
   Built the backend and frontend business logic for monthly budget tracking, including live spending calculation, dynamic progress bars, the 80% spending warning threshold, and over-budget alert states.

5. **Error Handling & Data Sanitization**:
   Implemented centralized Express error handling to gracefully intercept Mongoose `CastError` (invalid ObjectIds), `ValidationError`, and MongoDB `11000` duplicate key errors.

---

## Available API Endpoints

### Transactions (`/api/transactions`)
- `GET /api/transactions` — Fetch paginated transactions with search, type, category, date range, and sort query parameters.
- `GET /api/transactions/:id` — Fetch single transaction by ID.
- `POST /api/transactions` — Create a new transaction.
- `PUT /api/transactions/:id` — Update an existing transaction.
- `DELETE /api/transactions/:id` — Delete a transaction by ID.

### Budgets (`/api/budgets`)
- `GET /api/budgets` — Fetch all monthly budgets with live spending status.
- `GET /api/budgets/current` — Fetch budget for the current/selected month.
- `POST /api/budgets` — Create or update (upsert) a monthly spending limit.
- `PUT /api/budgets/:id` — Update budget details.
- `DELETE /api/budgets/:id` — Remove a budget.

### Analytics (`/api/analytics`)
- `GET /api/analytics/summary` — Get total income, total expenses, net balance, and current month statistics.
- `GET /api/analytics/categories` — Get category-wise spending distribution and percentages.
- `GET /api/analytics/monthly` — Get monthly aggregated income versus expense trends.

---

## License
This project is open-source and available under the [MIT License](LICENSE).
