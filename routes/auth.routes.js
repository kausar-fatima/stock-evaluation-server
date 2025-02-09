const express = require("express");
const router = express.Router();
const userauthController = require("../controllers/userAccount.auth.controller");
const shopsController = require("../controllers/shops.controller");
const purchasedProductsController = require("../controllers/purchasedProducts.controller")
const saleoutProductsController = require("../controllers/saleoutProducts.controller")
const expensesController = require("../controllers/expenses.controller")

router.post("/register", userauthController.addUser);
router.post("/generate_otp", userauthController.generateOTP);
router.post("/verify_otp", userauthController.verifyOTP);
router.put("/forgot_password", userauthController.forgotPassword);
router.post("/login", userauthController.login);

router.post("/add_shopDetails", shopsController.addShopDetails);
router.post("/user/:userId/addShop", shopsController.addUserShops);
router.get("/user/:shopId/get_shopProductDetails", shopsController.getShopProductDetails);
router.get("/user/:userId/get_shopDetails", shopsController.getShopDetails);
router.put("/update_shopDetails", shopsController.updateShopDetails);
router.put("/update_shopProductsDetails/:shopId", shopsController.updateShopProductsDetail);
router.delete("/delete_shopDetails", shopsController.deleteShopDetails);

// Route for purchased product
router.post("/add_products", purchasedProductsController.addProduct);
router.get("/get_products/:shopId", purchasedProductsController.getAllProducts);
router.patch("/update_purchasedproducts/:productId", purchasedProductsController.updateProduct);
router.delete("/delete_purchasedproducts/:productId", purchasedProductsController.deleteProduct);

// Routes for saleout product
router.post("/add_saleoutproducts", saleoutProductsController.addProduct);
router.get("/get_saleoutproducts/:shopId", saleoutProductsController.getAllProducts);
router.patch("/update_saleoutproducts/:productId", saleoutProductsController.updateProduct);
router.delete("/delete_saleoutproducts/:productId", saleoutProductsController.deleteProduct);

// Route for purchased product
router.post("/add_expenses", expensesController.addExpense);
router.get("/get_expenses/:shopId", expensesController.getAllExpenses);
router.patch("/update_expenses/:expenseId", expensesController.updateExpense);
router.delete("/delete_expenses/:expenseId", expensesController.deleteexpense);

module.exports = router;
