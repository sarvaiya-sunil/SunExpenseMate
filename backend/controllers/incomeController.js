const xlsx = require("xlsx");
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, source, amount, date } = req.body;
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newIncome.save();
    res.status(201).json({ newIncome });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};
exports.deleteIncome = async (req, res) => {
  const incomeId = req.params.id;
  try {
    const deletedIncome = await Income.findByIdAndDelete({ _id: incomeId });
    if (!deletedIncome) {
      return res.status(404).json({ message: "No income found!" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.downloadExcelIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    if (income.length === 0) {
      return res.status(404).json({ message: "No incomoe data found" });
    }

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new(); // Create a work book
    const ws = xlsx.utils.json_to_sheet(data); // Transfer Json to shee format
    xlsx.utils.book_append_sheet(wb, ws, "Income"); // Append formated sheet into a work book
    xlsx.writeFile(wb, "income_details.xlsx"); // Write a file into local machine
    res.download("income_details.xlsx"); // Send file to the client (DOWNLOAD)
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
