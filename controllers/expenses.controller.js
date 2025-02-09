// controllers/expense.controller.js
const Expense = require("../models/expenses.model");
const ShopDetails = require("../models/shops.model");

// Controller function to add a expense
exports.addExpense = async (req, res, next) => {
  try {
    const { shopId, name, amount} = req.body;
    const expense = new Expense({
      shopId: shopId,
      name: name,
      amount: parseFloat(amount), // Parse price to double
    });
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    next(error); // Pass error to the error middleware
  }
};

// Controller function to get all expenses
exports.getAllExpenses = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shops = await ShopDetails.findById(shopId);
        if (!shops) {
            return res.status(404).json({ message: 'Shop not found' });
        }
    // Map expense prices to double
    const Expenses = await Expense.find({ shopId: { $in: shops._id } }).lean();

    // Map expense prices to double and include virtual id
    const expensesWithDoublePrices = Expenses.map(expense => {
      return {
        ...expense,
        amount: parseFloat(expense.amount) // Parse price to double
      };
    });
    res.status(200).json(expensesWithDoublePrices);
  } catch (error) {
    console.error("Error fetching expenses details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

// Controller function to update a expense
exports.updateExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;
    //console.log("Received expenseId:", expenseId);

    const { name, amount } = req.body;

    // Validate incoming data
    if (!name || isNaN(amount)) {
      return res.status(400).json({ status: "error", message: "Invalid input data" });
    }

    // Find the expense by ID
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ status: "error", message: "expense not found " + expenseId });
    }

    // Update expense fields
    expense.name = name;
    expense.amount = parseFloat(amount); // Parse price to float

    // Save the updated expense
    const updatedexpense = await expense.save();
    res.status(200).json({ status: "success", message: "expense updated successfully", data: updatedexpense });
  } catch (error) {
    console.error("Error updating expense:", error);
    next(error); // Pass error to the error middleware
  }
};


// Controller function to delete a expense
exports.deleteexpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).send({ status: "error", message: `expense not found ${expenseId}  ` });
    }
    // Find the expense by ID and delete it
    const deletedexpense = await Expense.findByIdAndDelete(expenseId);

    
    if (!deletedexpense) {
      return res.status(404).json({ status: "error", message: "expense not found" });
    }
    
    res.status(200).json({ status: "success", message: "expense deleted successfully" });
  } catch (error) {
      return res.status(404).send({ status: "error", message: `Error in deleting expense` });

    next(error); // Pass error to the error middleware
  }
};
