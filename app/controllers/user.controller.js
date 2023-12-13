const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.user;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const hashPassword = async (password) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

    hashPassword(req.body.password)
        .then(hashedPassword => {
            const user = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                rol: req.body.rol,
                password: hashedPassword
            };

            User.create(user)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Error: Cannot create user"
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error: Can't hash pass"
            });
        });
};

exports.login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Empty content"
        });
        return;
    }

    const userFound = await User.findOne({ where: { email: req.body.email } });

    if (userFound) {
        const matchPass = await bcrypt.compare(req.body.password, userFound.password);
        if (matchPass) {
            const authToken = generateAuthToken(userFound);
            res.json({ token: authToken, infoUser: userFound });
        } else {
            res.status(500).send({
                message: "Incorrect Password"
            });
        }
    } else {
        res.status(500).send({
            message: "Error: Email don't exist"
        });
    }
};

exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User updated succesfully"
                });
            } else {
                res.send({
                    message: `Error to update user with id: =${id}.`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error to update task with id: =${id}.`
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User removed succesfully"
                });
            } else {
                res.send({
                    message: `Error to remove user with id: =${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error to remove user with id: =${id}.`
            });
        });
};

const generateAuthToken = (userData) => {
    const secretKey = 'PR0T3CT0_F1N4l';
    const expiresIn = '1h';

    const payload = {
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        rol: userData.rol,
        profileImage: userData.profileImage,
        validEmail: userData.validEmail
    };

    const token = jwt.sign({ payload }, secretKey, { expiresIn });
    return token;
};