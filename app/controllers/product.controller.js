const db = require("../models");
const Product = db.product;
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: ''
    }
});

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const product = { ...req.body };

    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error: Cannot create product"
            });
        });
};

exports.findAll = async (req, res) => {
    const resProduct = await Product.findAll({ order: [['category', 'ASC']] });

    if (resProduct) {
        res.status(200).send(resProduct);
    } else {
        res.status(400).send({
            message: "Error: Cannot search products"
        });
    }
};

exports.findOne = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const resProduct = await Product.findByPk(req.params.id);

    if (resProduct) {
        res.status(200).send(resProduct);
    } else {
        res.status(400).send({
            message: "Error: Cannot search products"
        });
    }
};

exports.findAllFilter = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const filter = {};

    if (req.body.category) {
        filter['category'] = { [Op.like]: `%${req.body.category}%` };
    }

    if (req.body.name) {
        filter['name'] = { [Op.like]: `%${req.body.name}%` };
    }

    try {
        const resProduct = await Product.findAll({
            where: filter,
            order: [['name', 'ASC']]
        });

        if (resProduct) {
            res.status(200).send(resProduct);
        } else {
            res.status(400).send({
                message: "Error: Cannot search products"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


exports.delete = async (req, res) => {
    if (!req.params.id) {
        res.status(500).send("Empty id delete product");
        return;
    }

    const resProduct = await Product.destroy({ where: { id: req.params.id } });

    if (resProduct) {
        res.status(200).send({ message: "Delete Product Succesfully!", status: 200 });
    } else {
        res.status(400).send({
            message: "Error: Cannot destroy product"
        });
    }
};

exports.removeAvailable = async (req, res) => {
    if (!req.body) {
        res.status(500).send("Empty products");
        return;
    }

    Product.findByPk(req.body.productId)
        .then(product => {
            if (product) {
                if (product.availableQty - req.body.toDecrement >= 0) {
                    product.decrement('availableQty', { by: req.body.toDecrement });
                    if (product.availableQty - req.body.toDecrement <= 5) {
                        const mailOptions = {
                            from: '',
                            to: '',
                            subject: 'Producto con poco stock',
                            text: `El producto ${product.name} actualmente cuenta con ${product.availableQty - req.body.toDecrement},
                            se sugiere aumentar el stock`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error al enviar el correo:', error);
                            } else {
                                console.log('Correo electrónico enviado:', info.response);
                            }
                        });

                    }
                    res.status(200).send({ message: "Decrement successfully!" });
                } else {
                    res.status(400).send({
                        message: "Error: More of available stock"
                    });
                }
            } else {
                res.status(400).send({
                    message: "Error: Product dont exist"
                });
            }
        })
        .catch(err => {
            res.status(400).send({
                message: err.message
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Product.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Product updated succesfully"
                });
            } else {
                res.send({
                    message: `Error to update product with id: =${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error to update product with id: =${id}.`
            });
        });
};