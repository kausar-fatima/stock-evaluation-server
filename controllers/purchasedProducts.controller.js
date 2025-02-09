// controllers/product.controller.js
const Product = require("../models/purchasedProducts.model");
const ShopDetails = require("../models/shops.model");

// Controller function to add a product
exports.addProduct = async (req, res, next) => {
  try {
    const { shopId, name, price, quantity, category } = req.body;
    const product = new Product({
      shopId: shopId,
      name: name,
      price: parseFloat(price), // Parse price to double
      quantity: quantity,
      category: category
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error); // Pass error to the error middleware
  }
};

// Controller function to get all products
exports.getAllProducts = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shops = await ShopDetails.findById(shopId);
        if (!shops) {
            return res.status(404).json({ message: 'Shop not found' });
        }
    // Map product prices to double
    const purchasedProducts = await Product.find({ shopId: { $in: shops._id } }).lean();

    // Map product prices to double and include virtual id
    const productsWithDoublePrices = purchasedProducts.map(product => {
      return {
        ...product,
        price: parseFloat(product.price) // Parse price to double
      };
    });
    res.status(200).json(productsWithDoublePrices);
  } catch (error) {
    console.error("Error fetching purchased products details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

// Controller function to update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    //console.log("Received productId:", productId);

    const { name, price, quantity, category } = req.body;

    // Validate incoming data
    if (!name || !category || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({ status: "error", message: "Invalid input data" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found " + productId });
    }

    // Update product fields
    product.name = name;
    product.price = parseFloat(price); // Parse price to float
    product.quantity = quantity;
    product.category = category;

    // Save the updated product
    const updatedProduct = await product.save();
    res.status(200).json({ status: "success", message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    next(error); // Pass error to the error middleware
  }
};


// Controller function to delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).send({ status: "error", message: `Product not found ${productId}  ` });
    }
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    
    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
      return res.status(404).send({ status: "error", message: `Error in deleting Product` });

    next(error); // Pass error to the error middleware
  }
};
