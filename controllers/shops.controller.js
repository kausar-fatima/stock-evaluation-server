const ShopDetails = require("../models/shops.model");
const User = require('../models/user.model');

exports.getShopDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const shopDetails = await ShopDetails.find({ userId: { $in: user.id } });
        res.status(200).json(shopDetails);
    } catch (error) {
        console.error('Error fetching shop details:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getShopProductDetails = async (req, res) => {
    const { shopId } = req.params;

    try {
        // Specify the fields you want to include in the response
        const projection = {
            purchasedProducts: 1,
            saleOutProducts: 1,
            revenue: 1,
            profit: 1,
            loss: 1,
            expenses: 1
        };
        const shop = await ShopDetails.findById(shopId, projection).lean();
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error('Error fetching shop products details:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Endpoint to add a shop to a user
exports.addUserShops = async (req, res) => {
    const { userId } = req.params;
    const { shopId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const shop = await ShopDetails.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Add shopId to the user's shop_ids array if it doesn't already exist
        if (!user.shop_ids.includes(shopId)) {
            user.shop_ids.push(shopId);
            await user.save();
        }

        res.status(200).json({ message: 'Shop added to user successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding shop to user', error });
    }
};

// Add shop details (initially with minimal data)
exports.addShopDetails = async (req, res) => {
    try {
        const { userId, name, location } = req.body;

        // Create a new ShopDetails instance with minimal data
        const newShopDetails = new ShopDetails({
            userId,
            name,
            location
        });

        // Save the new shop details
        const savedShopDetails = await newShopDetails.save();

        // Return the saved shop details, including the shop ID
        return res.status(200).json(savedShopDetails);
    } catch (error) {
        console.error("Error adding shop details:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to add shop details",
            error: error.message
        });
    }
};

// Controller function to update a shopproductsdetail
exports.updateShopProductsDetail = async (req, res, next) => {
    try {
      const shopId = req.params.shopId;
  
      const { purchasedProducts, saleOutProducts, revenue, expenses, profit, loss } = req.body;
  
      // Find the productDetail by ID
      const productsdetail = await ShopDetails.findById(shopId);
      if (!productsdetail) {
        return res.status(404).json({ status: "error", message: "Shop products detail not found " + shopId });
      }

      // Update product detail fields
      productsdetail.purchasedProducts = parseFloat(purchasedProducts);
      productsdetail.saleOutProducts = parseFloat(saleOutProducts); // Parse price to float
      productsdetail.revenue = parseFloat(revenue);
      productsdetail.expenses = parseFloat(expenses);
      productsdetail.profit = parseFloat(profit);
      productsdetail.loss = parseFloat(loss);
  
      // Save the updated product detail
      const updatedProductdetail = await productsdetail.save();
      res.status(200).json({ status: "success", message: "Products detail updated successfully", data: updatedProductdetail });
    } catch (error) {
      console.error("Error updating products detail:", error);
      next(error); // Pass error to the error middleware
    }
  };
  

// Update shop details (additional fields)
exports.updateShopDetails = async (req, res) => {
    try {
        const { shopId } = req.params;
        const updateData = req.body;

        // Update the existing shop details with additional fields
        const updatedShopDetails = await ShopDetails.findByIdAndUpdate(
            shopId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedShopDetails) {
            return res.status(404).json({ message: 'Shop details not found' });
        }

        res.status(200).json(updatedShopDetails);
    } catch (error) {
        console.error("Error updating shop details:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to update shop details",
            error: error.message
        });
    }
};

exports.updateShopDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedShopDetails = await ShopDetails.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedShopDetails);
    } catch (error) {
        console.error("Error updating shop details:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to update shop details",
            error: error.message
        });
    }
};

exports.deleteShopDetails = async (req, res) => {
    const { id } = req.params;
    try {
        await ShopDetails.findByIdAndDelete(id);
        res.status(200).json({ message: "Shop details deleted successfully" });
    } catch (error) {
        console.error("Error deleting shop details:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to delete shop details",
            error: error.message
        });
    }
};
