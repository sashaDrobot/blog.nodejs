const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

router.post('/register', (req, res) => {
    const {login, password, passwordConfirm} = req.body;

    if (!login || !password || !passwordConfirm) {
        const fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');
        if (!passwordConfirm) fields.push('passwordConfirm');

        res.json({
            ok: false,
            error: 'Все поля должны быть заполнены!',
            fields
        });
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: 'Только латинские буквы и цифры!',
            fields: ['login']
        });
    } else if (login.length < 3 || login.length > 20) {
        res.json({
            ok: false,
            error: 'Длина логина от 3 до 20 символов!',
            fields: ['login']
        });
    } else if (password.length < 6) {
        res.json({
            ok: false,
            error: 'Минимальная длина пароля 6 символов!',
            fields: ['password']
        });
    }
    else if (password !== passwordConfirm) {
        res.json({
            ok: false,
            error: 'Пароли не совпадают!',
            fields: ['password', 'passwordConfirm']
        });
    } else {
        models.User.findOne({
            login
        }).then(user => {
            if (!user) {
                bcrypt.hash(password, null, null, (err, hash) => {
                    models.User.create({
                        login,
                        password: hash
                    }).then(user => {
                        res.json({
                            ok: true
                        });
                    });
                })
            } else {
                res.json({
                    ok: false,
                    error: 'Имя занято!',
                    fields: ['login']
                });
            }
        });

    }
});

module.exports = router;