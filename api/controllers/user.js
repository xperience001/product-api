const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Response = require('../response/response');

module.exports = {

    createUser: (req, res, next)=>{

        User.findOne({email: req.body.email})
        .exec()
        .then( data =>{
            if(data){
                res.status(409).json({
                statusCode: 409,
                message: 'email passed does exists'
            });
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hpass)=>{

                    if(err){
                        res.status(500).json({
                            error: err.message
                        });
                    }
                    else{
        
                        const user = new User({
                            email: req.body.email,
                            password: hpass
                        });
                        user.save()
                        .then( user=>{
                            res.status(200).json({
                                error:false,
                                message: `User created succesfully with id ${user._id}`
                            });
                        })
                        .catch( err=>{
                            Response(res)
                            .error_res(err, 500)
                        });
                    }
                });
            }
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500);
        });
    },
    logUserIn: (req, res, next)=>{
        User.findOne({email: req.body.email})
        .exec()
        .then( user=>{
            if(!user){
                return res.status(401).json({
                    error: true,
                    message: 'Email does not exist kindly sign up'
                });
            }
            else{
                bcrypt.compare(req.body.password, user.password, (err, result)=>{
                    if(err){
                        return res.status(401).json({
                            error: true,
                            message: 'Auth failed'
                        });
                    }
                    if(result){
                        const token =jwt.sign({
                            email: user.email,
                            userID: user._id
                          },
                          process.env.JWT_SECRET,
                           {
                             expiresIn: "1h"
                              }
                        );
                        
                        return res.status(200).json({
                            error: false,
                            message: 'You logged in succesfully',
                            token: token
                        });
                    }
                    else{
                        return res.status(401).json({
                            error: true,
                            message: 'Incorrect password'
                        });
                    }
                });
            }
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500);
        });
    },
    deleteUser: (req, res, next)=>{
        User.deleteOne({_id: req.params.id})
        .then( data=>{
            res.status(200).json({
                error: false,
                message: `User was deleted succesfully`
            });
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500);
        });
    }
}