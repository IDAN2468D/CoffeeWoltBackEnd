const express = require("express");
const Coffee = require("../models/Coffee");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const coffees = await Coffee.find();
        const updatedCoffees = coffees.map((coffee) => ({
            ...coffee._doc,
            imagelink_square: `/src/assets/coffee_assets/${coffee.imagelink_square}`,
            imagelink_portrait: `/src/assets/coffee_assets/${coffee.imagelink_portrait}`,
        }));
        res.status(200).json(updatedCoffees);
    } catch (err) {
        res.status(500).json({ message: "Error fetching coffee data", error: err });
    }
});

router.get("/:_id", async (req, res) => {
    const _id = req.params._id.replace(":", "");
    try {
        const coffee = await Coffee.findById(_id);
        if (!coffee) {
            return res.status(404).json({ message: "Coffee not found" });
        }
        res.status(200).json(coffee);
    } catch (err) {
        res.status(500).json({ message: "Error fetching coffee", error: err });
    }
});

module.exports = router;