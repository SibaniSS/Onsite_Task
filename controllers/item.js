const { Item } = require('../model/item');

exports.createItem = async (req, res) => {
    const { title, description, images, startingPrice, auctionDuration, category } = req.body;
    const sellerId = req.user._id; 

    try {
        const newItem = new Item({
            title,
            description,
            images,
            startingPrice,
            auctionDuration,
            category,
            seller: sellerId,
        });

        await newItem.save();
        res.status(201).send({ message: 'Item created successfully', item: newItem });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create item' });
    }
};

exports.updateItem = async (req, res) => {
    const itemId = req.params.id;
    const sellerId = req.user._id;
    const updates = req.body;

    try {
        const item = await Item.findOneAndUpdate(
            { _id: itemId, seller: sellerId },
            updates,
            { new: true }
        );

        if (!item) {
            return res.status(404).send({ error: 'Item not found or not authorized' });
        }

        res.send({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update item' });
    }
};

exports.deleteItem = async (req, res) => {
    const itemId = req.params.id;
    const sellerId = req.user._id;

    try {
        const item = await Item.findOneAndDelete({ _id: itemId, seller: sellerId });

        if (!item) {
            return res.status(404).send({ error: 'Item not found or not authorized' });
        }

        res.send({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete item' });
    }
};
