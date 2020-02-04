const db = require("../../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require("../../config/config.json");

const usersController = {


    //creating users 
    create: async (req, res) => {
        const response = {};
        let { fullName, address, phone } = req.body;
        db.users.create({
            fullName: fullName,
            address: address,
            phone: phone,

        }).then(async ress => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                message: 'user has been created',
                data: ress,

            }
            );
            await res.status(response.statusCode).send(response.body);
        }).catch(err => {
            console.log("err", err);
            response.statusCode = 500;
            response.body = JSON.stringify({ "errors: ": err });
            res.status(response.statusCode).send(response.body);
        })
    },
    //deleting one user details by id
    delete: async (req, res) => {
        let response = {};
        db.users.destroy({
            where: {
                id: req.params.id
            }
        }).then(async () => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                message: 'user deleted',


            });
            res.status(200).send(response.body);

        })
            .catch(err => {
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
            });

    },
    //getting one user details by id
    getOne: async (req, res) => {

        const response = {};
        if ("undefined" !== req.params.id) {

            db.users.findOne({
                attributes: ['fullName', 'address', 'phone'],
                where: { [Op.and]: [{ id: req.params.id }] }
            }).then(data => {
                response.statusCode = 200;
                response.body = JSON.stringify(
                    {
                        message: "ok",
                        data: data
                    }
                );
                res.status(response.statusCode).send(response.body);

            }).catch(err => {
                console.log("error", err);
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
            })
        }
    },
    //getting  all users 
    all: async (req, res) => {
        let { page, limit } = req.query;
        page = page ? parseInt(page) : 1;         //pagination
        limit = limit ? parseInt(limit) : 10;
        let response = {};
        db.users.findAndCountAll({
            attributes: ['id', 'fullName', 'address', 'phone'],

            order: [['id', 'ASC']], // sorting fields by ascending and descending order
            offset: (page - 1) * limit, //declaring offset
            limit: limit
        }).then(async result => {
            response.statusCode = 200;
            response.body = JSON.stringify({
                success: true,
                users: await result.rows,
                totalUsers: await result.count,
                totalPages: await (parseInt((result.count / limit)) + 1),    //no of total pages
                currentPage: await page
            });
            res.status(response.statusCode).send(response.body);
        })
            .catch(err => {
                response.statusCode = 500;
                response.body = JSON.stringify({ err });
                res.status(response.statusCode).send(response.body);
                console.log(err);

            });

    },
    //updating information of a user by id
    update: async (req, res) => {
        const response = {};

        let { id } = req.params;

        try {
            let data = {};
            data["fullName"] = req.body.fullName;
            data["address"] = req.body.address;
            data["phone"] = req.body.phone;

            await db.users.update(data, {
                where: {
                    id
                }
            }).then(async data => {
                response.statusCode = 200;
                response.body = JSON.stringify({
                    message: 'user has been updated',
                    data: data

                });
                await res.status(response.statusCode).send(response.body);
            })
                .catch(err => {
                    response.statusCode = 506;
                    response.body = JSON.stringify({ err });
                    res.status(response.statusCode).send(response.body);
                });
        } catch (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({ err });
            res.status(response.statusCode).send(response.body);
        }
    },


}
module.exports = usersController;