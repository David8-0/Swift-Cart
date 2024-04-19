const userModel = require('../Models/userModel');

exports.addToMyFavorites = async (req, res) => {
  try {
    const user = await userModel.findById(req.freshUser._id);
    //   console.log(req.body.productId);
    await user.addToFav(req.body.productId);
    res.status(200).json({
      status: 'success',
      data: {
        favorites: user.favorites,
        numberOfItems: user.favorites.length,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.removeFromMyFavorites = async (req, res) => {
  try {
    const user = await userModel.findById(req.freshUser._id);
    await user.removeFromFav(req.body.productId);
    res.status(200).json({
      status: 'success',
      data: {
        favorites: user.favorites,
        numberOfItems: user.favorites.length,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getMyFavorites = async (req, res) => {
  try {
    const user = await userModel.findById(req.freshUser._id);
    res.status(200).json({
      status: 'success',
      data: {
        favorites: user.favorites,
        numberOfItems: user.favorites.length,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.clearMyFavorites = async (req, res) => {
  try {
    const user = await userModel.findById(req.freshUser._id);
    user.favorites = [];
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      data: {
        favorites: user.favorites,
        numberOfItems: user.favorites.length,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
