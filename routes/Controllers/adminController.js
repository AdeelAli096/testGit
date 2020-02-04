const db = require("../../models");
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const config = require("../../config/config.json");

const AdminController = {
    login: (req, res) => {
        const response = {};

        try {
            let { email, password } = req.body;
            db.admin.findOne({
                where: { email }
            }).then((admin) => {

                if (!admin) {
                    response.statusCode = 404;
                    response.body = JSON.stringify({
                        message: "Incorrect email or doesn't exist",
                        success: false
                    });
                    res.status(response.statusCode).send(response.body);
                }
                else {
                    bcrypt.compare(password, admin.password)
                        .then(valid => {
                            if (!valid) {
                               
                                response.statusCode = 404;
                                response.body = JSON.stringify({
                                    message: 'Incorrect password',
                                    success: false
                                });
                                res.status(response.statusCode).send(response.body);
                            }
                            else {
                                // signin user and generate a jwt
                                const token = jsonwebtoken.sign({
                                    id: admin.id,
                                    email: admin.email,
                                    firstName: admin.firstName,
                                    lastName: admin.lastName
                                }, config.jwt.passPhrase, { expiresIn: '1y' });

                                // return json web token
                                response.statusCode = 200;
                                response.body = JSON.stringify({
                                    message: 'User Logged IN',
                                    success: true,
                                    token: token
                                });
                                res.status(response.statusCode).send(response.body);
                            }
                        })
                }
            })
                .catch(err => {
                    console.log("error", err);
                    response.statusCode = 500;
                    response.body = JSON.stringify({ err });
                    res.status(response.statusCode).send(response.body);
                });
        } catch (err) {
            console.log("error", err);
            response.statusCode = 500;
            response.body = JSON.stringify({ err });
            res.status(response.statusCode).send(response.body);
        }
    },
    createAdmin: async (req, res) => {
        const response = {};
        try {
            //signing up for shops

            let { firstName, lastName, email, password } = req.body;
            db.admin.count({ where: { email: req.body.email } })
                .then(count => {
                    if (count !== 0) {
                        response.statusCode = 409;
                        response.body = JSON.stringify({
                            message: 'Email already Exsist',
                        });
                        res.status(response.statusCode).send(response.body);
                    }
                    else {
                        let encryptedPassword = bcrypt.hashSync(password, 10);
                        db.admin.create({
                            firstName,
                            lastName,
                            email,
                            password: encryptedPassword,
                           

                        }).then(data => {
                            // signin admin and generate a jwt
                            const token = jsonwebtoken.sign({
                                id: data.id,
                                email: data.email,
                                
                            }, config.jwt.passPhrase, { expiresIn: '1y' });
                            let finalResponse = {
                                admin: {
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    email: data.email
                                }
                            };
                            response.statusCode = 200;
                            response.body = JSON.stringify({
                                message: 'New Admin Created',
                                data: finalResponse,
                                token: token
                            });
                            res.status(response.statusCode).send(response.body);
                        })
                            .catch(err => {
                                response.statusCode = 500;
                                response.body = JSON.stringify({ err });
                                res.status(response.statusCode).send(response.body);
                                console.log(err);
                            });
                            
                            
                    }
                });
        } catch (err) {
            console.log("err", err);
            response.statusCode = 500;
            response.body = await JSON.stringify(err);
            await res.status(response.statusCode).end(response.body);
        }
    }
    /*validateToken: async (req, res) => {
        let response = {};
        response.statusCode = 200;
        response.body = JSON.stringify({
            success: true,
        });
        res.status(response.statusCode).send(response.body);
    }*/
};
module.exports = AdminController;