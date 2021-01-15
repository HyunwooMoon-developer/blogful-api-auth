/* eslint-disable no-undef */
const express = require('express');
const usersService = require('./users-service');

const usersRouter = express.Router()
const jsonParser = express.json();

usersRouter
.post('/', jsonParser, (req, res, next) => {
    const {password , user_name } = req.body;
    
    for(const filed of ['full_name', 'user_name' , 'password'])
    if(!req.body[filed])
    return res.status(400).json({
        error: `Missing '${filed}' in request body`
    })

    const passwordError = usersService.validatePassword(password)
    
    if(passwordError)
    return res.status(400).json({error : passwordError})
    
    usersService.hasUserWithUsername(
        req.app.get('db'),
        user_name
    )
    .then(hasUserWithUsername => {
        if(hasUserWithUsername)
        return res.status(400).json({error : `Username already taken`})
    res.send('ok')
    })
    .catch(next)

})

module.exports = usersRouter;