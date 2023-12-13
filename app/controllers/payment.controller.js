const db = require("../models");
const Payment = db.payment;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const payment = {...req.body};

    Payment.create(payment)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Error: Cannot create payment"
        });
    });
};

exports.findAll = async (req, res) => {
    const resPayment = await Payment.findAll({order: [['name', 'ASC']]});

    if(resPayment){
        res.status(200).send(resPayment);
    }else{
        res.status(400).send({
            message: "Error: Cannot search payments"
        });
    }
};

exports.delete = async (req, res) => {
    if(!req.params.id){
        res.status(500).send("Empty id delete payment");
        return;
    }

    const resPayment = await Payment.destroy({where: {id:req.params.id}});

    if(resPayment){
        res.status(200).send({message: "Delete Payment Succesfully!", status: 200});
    }else{
        res.status(400).send({
            message: "Error: Cannot destroy payment"
        });
    }
};