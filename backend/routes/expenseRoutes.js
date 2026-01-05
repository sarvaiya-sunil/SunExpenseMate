const express = require("express");
const {
  addExpense,
  getAllExpense,
  downloadExcelExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExcelExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
