const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const tableBody = document.getElementById("expenseTable");
const totalDisplay = document.getElementById("total");
const filterCategory = document.getElementById("filterCategory");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

renderTable();

//Add expense
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!name || !amount) return alert("Please enter valid data!");

  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const expense = { name, amount, category, date };
  expenses.push(expense);
  total += amount;

  saveData();
  renderTable();

  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Food🍜";
});

//Clear All
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all expenses?")) {
    expenses = [];
    total = 0;
    saveData();
    renderTable();
  }
});

//Download CSV
downloadBtn.addEventListener("click", () => {
  if (expenses.length === 0) {
    alert("No expenses to download!");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Amount,Category,Date\n";
  expenses.forEach(exp => {
    csvContent += `${exp.name},${exp.amount},${exp.category},${exp.date}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "expenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Render table
filterCategory.addEventListener("change", renderTable);
sortBy.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

function renderTable() {
  tableBody.innerHTML = "";
  let filteredExpenses = [...expenses];

  // Filter
  if (filterCategory.value !== "all") {
    filteredExpenses = filteredExpenses.filter(exp => exp.category === filterCategory.value);
  }

  // Search
  const searchText = searchInput.value.toLowerCase();
  if (searchText) {
    filteredExpenses = filteredExpenses.filter(exp => exp.name.toLowerCase().includes(searchText));
  }

  // Sort
  if (sortBy.value === "amountAsc") {
    filteredExpenses.sort((a, b) => a.amount - b.amount);
  } else if (sortBy.value === "amountDesc") {
    filteredExpenses.sort((a, b) => b.amount - a.amount);
  } else if (sortBy.value === "dateAsc") {
    filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy.value === "dateDesc") {
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Render rows
  filteredExpenses.forEach((exp, index) => {
    const row = `<tr>
      <td>${exp.name}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button onclick="deleteExpense(${index})">❌</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });

  totalDisplay.innerText = total;
}

// Delete
function deleteExpense(index) {
  total -= expenses[index].amount;
  expenses.splice(index, 1);
  saveData();
  renderTable();
}

// Save
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
