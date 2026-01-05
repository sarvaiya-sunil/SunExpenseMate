const xlsx = require("xlsx");
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized" });
  }
  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });
    await newExpense.save();
    res.status(201).json({ newExpense });
  } catch (error) {
    console.log("Add expense error:", error);
    res.status(500).json({ message: "server error" });
  }
};
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const deletedExpense = await Expense.findByIdAndDelete({ _id: expenseId });
    if (!deletedExpense) {
      return res.status(404).json({ message: "No expense found!" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.downloadExcelExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    if (expense.length === 0) {
      return res.status(404).json({ message: "No expense data found" });
    }

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// I have done one mistake that, i created wrong field ObjectId indtead of userId, when i realize i changed it, but when i was changing, the server is running, so mongoose keep the old schema in its cache, so that's why i have tried many times to add expenses but it gives me everytime the same error that internal server error. So the thing that you have to notice is when you do any changes with models or database, once stop the server and then restart it.
