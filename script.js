// ===============================
// Static Transaction Data
// ===============================

const transactions = [
  {
    id: "TXN001",
    date: "2026-08-10",
    description: "Office Rent",
    type: "expense",
    amount: 50000,
    status: "Paid",
  },
  {
    id: "TXN002",
    date: "2026-08-11",
    description: "Client Payment",
    type: "income",
    amount: 150000,
    status: "Received",
  },
  {
    id: "TXN003",
    date: "2026-08-12",
    description: "Software License",
    type: "expense",
    amount: 25000,
    status: "Pending",
  },
];

// ===============================
// Budget
// ===============================

const annualBudget = 2000000;

// ===============================
// DOM Elements
// ===============================

const filterForm = document.querySelector(".filter-form");

const transactionType = document.querySelector("#transaction-type");

const startDate = document.querySelector("#start-date");

const endDate = document.querySelector("#end-date");

const transactionTableBody = document.querySelector(".transaction-table tbody");

const emptyState = document.querySelector(".empty-state");

const summaryCards = document.querySelectorAll(".summary-card");

const revenueElement = summaryCards[0].querySelector("p");

const expensesElement = summaryCards[1].querySelector("p");

const profitElement = summaryCards[2].querySelector("p");

const budgetElement = summaryCards[3].querySelector("p");

// ===============================
// Currency Format
// ===============================

function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ===============================
// Display Transactions
// ===============================

function displayTransactions(data) {
  transactionTableBody.innerHTML = "";

  if (data.length === 0) {
    emptyState.style.display = "block";

    return;
  }

  emptyState.style.display = "none";

  data.forEach((transaction) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.type}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td>${transaction.status}</td>
        `;

    transactionTableBody.appendChild(row);
  });
}

// ===============================
// Calculate Totals
// ===============================

function calculateTotals(data) {
  const totalRevenue = data
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

  const totalExpenses = data
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

  const netProfit = totalRevenue - totalExpenses;

  revenueElement.textContent = formatCurrency(totalRevenue);

  expensesElement.textContent = formatCurrency(totalExpenses);

  profitElement.textContent = formatCurrency(netProfit);

  budgetElement.textContent = formatCurrency(annualBudget);
}

// ===============================
// Budget Calculation
// ===============================

function calculateBudget(data) {
  const totalExpenses = data
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);

  const remainingBudget = annualBudget - totalExpenses;

  const budgetVariance = annualBudget - totalExpenses;

  const budgetList = document.querySelector(".budget-list");

  budgetList.innerHTML = `
        <dt>Annual Budget</dt>
        <dd>${formatCurrency(annualBudget)}</dd>

        <dt>Used Budget</dt>
        <dd>${formatCurrency(totalExpenses)}</dd>

        <dt>Remaining Budget</dt>
        <dd>${formatCurrency(remainingBudget)}</dd>

        <dt>Budget Variance</dt>
        <dd>${formatCurrency(budgetVariance)}</dd>
    `;
}

// ===============================
// Filter Transactions
// ===============================

function filterTransactions() {
  const selectedType = transactionType.value;

  const selectedStartDate = startDate.value;

  const selectedEndDate = endDate.value;

  const filteredData = transactions.filter((transaction) => {
    const matchesType =
      selectedType === "" || transaction.type === selectedType;

    const matchesStartDate =
      selectedStartDate === "" || transaction.date >= selectedStartDate;

    const matchesEndDate =
      selectedEndDate === "" || transaction.date <= selectedEndDate;

    return matchesType && matchesStartDate && matchesEndDate;
  });

  displayTransactions(filteredData);

  calculateTotals(filteredData);

  calculateBudget(filteredData);

  calculateMonthlySummary(filteredData);
}

// ===============================
// Monthly Summary
// ===============================

function calculateMonthlySummary(data) {
  const monthlySummary = {};

  data.forEach((transaction) => {
    const month = transaction.date.substring(0, 7);

    if (!monthlySummary[month]) {
      monthlySummary[month] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.type === "income") {
      monthlySummary[month].income += transaction.amount;
    }

    if (transaction.type === "expense") {
      monthlySummary[month].expense += transaction.amount;
    }
  });

  const monthlyContainer = document.querySelector("#monthly-summary");

  monthlyContainer.innerHTML = "";

  Object.keys(monthlySummary).forEach((month) => {
    const income = monthlySummary[month].income;

    const expense = monthlySummary[month].expense;

    const profit = income - expense;

    const article = document.createElement("article");

    article.innerHTML = `
            <h3>${month}</h3>

            <p>
                Income:
                ${formatCurrency(income)}
            </p>

            <p>
                Expense:
                ${formatCurrency(expense)}
            </p>

            <p>
                Profit:
                ${formatCurrency(profit)}
            </p>
        `;

    monthlyContainer.appendChild(article);
  });
}

// ===============================
// Form Submit Event
// ===============================

filterForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get selected dates
  const start = startDate.value;
  const end = endDate.value;

  // Validate date range
  if (start > end) {
    alert("Start date cannot be after end date.");
    return;
  }

  filterTransactions();
});

// ===============================
// Initial Page Load
// ===============================

displayTransactions(transactions);

calculateTotals(transactions);

calculateBudget(transactions);

calculateMonthlySummary(transactions);
