const Category = require("../../model/category.model");


const addCategory = async (req, res) => {
    try {
        const { CategoryName } = req.body

        const CategoryImage = req?.file ? req?.file?.filename : "";

        let savedCategory = await Category.create({
            CategoryName: CategoryName,
            CategoryImage: CategoryImage
        })
        return res.status(200).json({
            savedCategory,
            "message": "category will be added sucessfuly"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": 'Internal Server Error' });
    }
}
const getAllCategory = async (req, res) => {
    try {
        let allcategory = await Category.find({})
        return res.status(200).json({
            allcategory
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({ "message": 'Internal Server Error' });
    }
}

module.exports = {
    addCategory, getAllCategory
}