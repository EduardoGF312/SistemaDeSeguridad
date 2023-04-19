const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require('../secret/config')

router.post('/userlogin', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if(!user) {
        return res.status(400).send('Invalid username or password');
    }

    const validPassword = bcrypt.compare(password, user.password);
    if(!validPassword) {
        return res.status(400).send('Invalid username or password');
    }

    //Generar el token de autenticacion
    const token = jwt.sign({_id: user._id, username: user.username}, config.secret, {expiresIn: '1h'});

    // //DECODIFICAR EL TOKEN
    // const decoded = jwt.verify(token, config.secret);

    res.send({ token, decoded })
})

module.exports = router;