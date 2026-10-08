# SpendWise — Full-Stack Expense Tracker (MERN)

SpendWise is a full-stack personal finance and expense tracking web application engineered with the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js) and styled with Tailwind CSS.

The application features a modern, recruiter-friendly dashboard inspired by Stripe's clean visual design, incorporating a custom **Tan-Hide Warm Ochre** color palette, responsive navigation, real-time MongoDB aggregations, category breakdowns, monthly cash flow charts, and monthly budget limit guardrails.

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

### 3. Monthly Budgeting
- Set custom monthly spending limits persisted directly in MongoDB.
- Live calculation of spent and remaining budget.
- Automatic visual warning when spending crosses 80% of the set limit.
- High-priority alert banner when the budget is exceeded.

### 4. Analytics & Insights
- Category-wise expense and income breakdown.
- Monthly expense and income velocity area chart.
- Granular breakdown table with transaction counts, average order values, and share percentages.
- Timeline selector for 3, 6, and 12-month views.

### 5. Polished User Interface & Design
- **Custom Tan-Hide Color Palette**: Modern warm ochre tones (`#fff7ed` to `#411509`).
- **Typography**: Google Fonts **Plus Jakarta Sans**.
- **Vector Icons**: Lightweight modular icons from `react-icons/hi2`.
- **Toast Notifications**: Built-in floating notifications for instant feedback on create, edit, and delete operations.
- **Responsive Layout**: Desktop sidebar navigation and mobile collapsible drawer.

---

## Technologies Used

- **Frontend**: React.js 19 with Vite, Tailwind CSS, Framer Motion, Axios
- **Charts**: Recharts
- **Icons**: React Icons (`react-icons/hi2`)
- **Backend**: Node.js, Express.js, Morgan, CORS, Dotenv
- **Database**: MongoDB with Mongoose ODM
- **Development & Process**: Kiro / Antigravity AI assistant

---

## Setup and Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) connection string (or a local MongoDB instance running on `mongodb://localhost:27017/spendwise`)

### 1. Clone or Open the Workspace
```bash
cd expense-tracker-anjana-task-startupmeu
```

### 2. Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
cd ..
```

#### Install Frontend Dependencies:
```bash
cd client
npm install
cd ..
```

*(Alternatively, install both from the root directory using: `npm run install:all`)*

---

## Environment Variable Configuration

### Backend Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/spendwise?retryWrites=true&w=majority
```

### Frontend Configuration (`client/.env`)
Create a `.env` file inside the `client/` directory (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Atlas Setup:
1. Create a free M0 cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a Database User with read/write access under **Database Access**.
3. Whitelist your IP or `0.0.0.0/0` under **Network Access**.
4. Click **Connect** → **Drivers** to copy your connection string.
5. Paste it into `server/.env` under `MONGODB_URI` with your user password and database name `spendwise`.

---

## How to Run the Application

The backend and frontend are designed to run **separately** in two distinct terminal windows.

### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```
- The backend server will start on: **`http://localhost:5000`**

### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```
- The Vite React application will start on: **`http://localhost:5173`**

### (Optional) Seed Realistic Demo Data:
To populate realistic transactions (Salary, Rent, Groceries, Freelance, Subscriptions) and sample monthly budgets:
```bash
cd server
npm run seed
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
