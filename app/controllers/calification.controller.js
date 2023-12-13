const db = require("../models");
const Calification = db.calification;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.content || !req.body.rate) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    Calification.create(req.body)
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
    if (!req.params.productId) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const resCalification = await Calification.findAll({where: {productId: req.params.productId},order: [['rate', 'DESC']]});

    if(resCalification){
        res.status(200).send(resCalification);
    }else{
        res.status(400).send({
            message: "Error: Cannot search califications"
        });
    }
};