const _ = require('lodash');
const { Profile } = require('../models/profile');
const { Order } = require('../models/order');

module.exports.getProfile = async (req, res) => {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });
    return res.status(200).send(profile);
}
module.exports.getOrders = async (req, res) => {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    console.log("User Id\n\n", userId);
    console.log(orders);
    return res.status(200).send(orders);
}
module.exports.getProfileById = async (req, res) => {
    const userId = req.headers.userid;
    const profile = await Profile.findOne({ user: userId });
    return res.status(200).send(profile);
}
//Create And Update
module.exports.setProfile = async (req, res) => {
    const userId = req.user._id;
    const userProfile = _.pick(req.body, ["phone", "address1", "address2", "city", "postcode", "country"]);

    userProfile["user"] = userId;
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
        await Profile.updateOne({ user: userId }, userProfile);
    } else {
        profile = new Profile(userProfile);
        await profile.save();
    }
    return res.status(200).send("Updated Successfully");
}