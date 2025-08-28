const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("expenseTable");
const totalDisplay = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

renderTable();

// To Add new expense
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (!name || !amount) return alert("Please enter valid data!");

  //For Auto generate date
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const expense = { name, amount, category, date };
  expenses.push(expense);
  total = total + amount;

  saveData();
  renderTable();

  // Clear input fields after adding
  nameInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Food🍜";
});

// Table
function renderTable() {
  tableBody.innerHTML = "";
  expenses.forEach((exp, index) => {
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

// To Delete expense
function deleteExpense(index) {
  total =total - expenses[index].amount;
  expenses.splice(index, 1);
  saveData();
  renderTable();
}

// For Saving
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
