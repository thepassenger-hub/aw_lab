//import express
const express = require('express');
const dao = require('./task_dao');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.jwtSecret;

const csrf = require('csurf');
const { check, validationResult } = require('express-validator');
//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());
app.use(cors({}));
// Set-up the 'client' component as a static website
app.use(express.static('client'));
app.get('/', (req, res) => res.redirect('/index.html'));


// DB error
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const expireTime = 60 * 60 * 24 * 7; //1 week

app.use(cookieParser());

// Authentication endpoint
app.post('/api/login', [
    check('email').isEmail(),
    check('email').isString().isLength({ min: 6 }),
], (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    dao.checkUserPass(email, password)
        .then((userObj) => {
            const token = jsonwebtoken.sign({ userID: userObj.userID }, jwtSecret, { expiresIn: expireTime });
            res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
            res.json(userObj);
        }).catch(
            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            () => new Promise((resolve) => {
                setTimeout(resolve, 1000)
            }).then(
                () => res.status(401).end()
            )
        );
});


const csrfProtection = csrf({
    cookie: { httpOnly: true, sameSite: true }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// With the following line, for the rest of the code, all routes would require the CSRF token
//app.use(csrfProtection);
// To use it only for specific routes, add  csrfProtection  in the list of middlewares in the route
// CORS is needed only for routes that have side effects (e.g., POST, PUT, DELETE)

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// Provide an endpoint for the App to retrieve the CSRF token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

// REST API endpoints

//GET /tasks
app.get('/tasks', csrfProtection, (req, res) => {
    dao.getTasks(req.query.filter)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//GET /tasks/<taskId>
app.get('/tasks/:taskId', csrfProtection, (req, res) => {
    dao.getTask(req.params.taskId)
        .then((course) => {
            if (!course) {
                res.status(404).send();
            } else {
                res.json(course);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

//POST /tasks
app.post('/tasks', csrfProtection, [
    check('description').isString().isLength({ min: 5 }),
    check('private').isBoolean(),
    check('important').isBoolean(),
    check('project').isString(),
    check('id').optional()
], (req, res) => {
    const task = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    if (!task) {
        res.status(400).end();
    } else {
        console.log(task);
        dao.createTask(task)
            .then((id) => res.status(201).json({ "id": id }))
            .catch((err) => res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            }));
    }
});

//DELETE /tasks/<taskId>
app.delete('/tasks/:taskId', csrfProtection, (req, res) => {
    dao.deleteTask(req.params.taskId)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

//PUT /tasks/<taskId>
app.put('/tasks/:taskId', csrfProtection, [
    check('description').isString().isLength({ min: 5 }),
    check('private').isBoolean(),
    check('important').isBoolean(),
    check('project').isString(),
    check('id').isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    if (!req.body.id) {
        res.status(400).end();
    } else {
        const task = req.body;
        dao.updateTask(req.params.taskId, task)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            }));
    }
});



//activate server
app.listen(port, () => console.log('Server ready'));
