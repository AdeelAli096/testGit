const cors = require('cors');
const bodyParser = require('body-parser');
//route controller
const users = require('./Controllers/usersController');
const admin = require('./Controllers/adminController');


exports = module.exports = (app) => {
    try {
        // middlewares
        //bodyParser as a parsing middleware
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        //CORS
        app.use(cors());

        // middleware to use for all requests
        // app.use(function (req, res, next) {
        //     console.log('middleware going on...');
        //     next();
        // });
        // Test server is runing endpoint
        app.get("/", (req, res) => {
            res.end("ok")
        });
    //   // admin login
       app.post('/api/login', admin.login);
    //   // create admin
       app.post("/api/createAdmin", admin.createAdmin);
    //   // token validator
    //   app.get("/api/validate-token", verifyToken, admin.validateToken);
       
        // users crud
        app.get('/api/users', users.all);
        app.post('/api/users',  users.create);
        app.delete('/api/users/:id',  users.delete);
        app.get('/api/users/:id',  users.getOne);
        app.put('/api/users/:id',  users.update);

       
    } catch (e) {
        console.log("across api catch err", e);
    }
};