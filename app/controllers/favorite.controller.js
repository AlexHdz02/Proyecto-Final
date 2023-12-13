const db = require("../models");
const Favorite = db.favorite;
const Product = db.product;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.userId || !req.body.productId) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    Favorite.create(req.body)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Error: Cannot create favorite"
        });
    });
};

exports.findAll = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const resFavorite = await Favorite.findAll({
        where: {userId: req.params.id},
        include: [{model: Product, as: "Product"}]
    });

    if(resFavorite){
        res.status(200).send(resFavorite);
    }else{
        res.status(400).send({
            message: "Error: Cannot search favorites"
        });
    }
};

exports.remove = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const resFavorite = await Favorite.destroy({
        where: {id: req.params.id},
    });

    if(resFavorite){
        res.status(200).send({message: "Destroy favorite successfully!"});
    }else{
        res.status(400).send({
            message: "Error: Cannot search favorites"
        });
    }
};