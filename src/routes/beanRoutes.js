const express = require("express");
const Bean = require("../models/Bean");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const beans = await Bean.find();
        
        const updatedBeans = beans.map((bean) => ({
            id: bean.id,
            name: bean.name,
            description: bean.description,
            roasted: bean.roasted,
            imagelink_square: `/src/assets/coffee_assets/${bean.imagelink_square}`,
            imagelink_portrait: `/src/assets/coffee_assets/${bean.imagelink_portrait}`,
            ingredients: bean.ingredients,
            special_ingredient: bean.special_ingredient,
            prices: bean.prices,
            average_rating: bean.average_rating,
            ratings_count: bean.ratings_count,
            favourite: bean.favourite,
            type: bean.type,
            index: bean.index,
        }));

        res.status(200).json(updatedBeans);
    } catch (err) {
        res.status(500).json({ message: "Error fetching beans data", error: err });
    }
});

router.get("/:_id", async (req, res) => {
    const _id = req.params._id.replace(":", "");
    try {
        const bean = await Bean.findById(_id);
        if (!bean) {
            return res.status(404).json({ message: "Bean not found" });
        }

        const updatedBean = {
            id: bean.id,
            name: bean.name,
            description: bean.description,
            roasted: bean.roasted,
            imagelink_square: `/src/assets/coffee_assets/${bean.imagelink_square}`,
            imagelink_portrait: `/src/assets/coffee_assets/${bean.imagelink_portrait}`,
            ingredients: bean.ingredients,
            special_ingredient: bean.special_ingredient,
            prices: bean.prices,
            average_rating: bean.average_rating,
            ratings_count: bean.ratings_count,
            favourite: bean.favourite,
            type: bean.type,
            index: bean.index,
        };

        res.status(200).json(updatedBean);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bean", error: err });
    }
});

module.exports = router;