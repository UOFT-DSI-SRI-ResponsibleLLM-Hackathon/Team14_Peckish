const Item = require('../models/itemModel');

exports.getExpiredItems = async (req, res) => {
  try {
    const currentTime = new Date();
    const expiredItems = await Item.find({ expiry: { $lt: currentTime } });
    res.status(200).json(expiredItems); // Return the expired items
  } catch (err) {
    res.status(500).json({ message: 'Error checking for expired items', error: err.message });
  }
};