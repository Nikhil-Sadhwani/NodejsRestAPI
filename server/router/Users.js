const express = require('express');
const fs = require('fs');
const db = require('../config/config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Gettin Model
const UserModel = db.user;

// Create Router
const router = express.Router();

// Import For Storing image
const multer = require('multer');
const path = require('path');


// Storing image
const storage = multer.diskStorage({
    destination: (req , file ,cb) => {
        cb(null , 'Images')
    },
    filename: (req , file , cb) =>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage : storage,
    limits:{fileSize : '1000000'},
    fileFilter:(req , file , cb) => {
        const fileTypes = /jpg|jpeg|png|gif|svg/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname){
            return cb(null , true)
        }
        cb("Extension are not match with those mentiond below");

    }
}).single('user_image')


// Token Verification

const isValidAuth = (req, res, next) => {
    const token = req.headers["x-access-token"];
    
    if(!token){
        res.json({message : "Failed to authenticate because Token is not passed"});
    }
    else{
        jwt.verify(token , "secret" , (err , decode) => {
            if(err){
                res.json({message : "Failed to authenticate"})
            } else{
                req.user_id = decode.id;
                next();
            }
        });
    }
};


// Api for insert new customer details
router.post("/insert",isValidAuth, upload , async (req , res) => {

    // Generate the hashed password by using the given password
    const hashedPassword = await bcrypt.hash(req.body.user_password , 10);

    // Create object by using request body object
    let user = {
        user_image: req.file? req.file.filename : null,
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: hashedPassword,
        total_orders : req.body.total_orders !== null ? req.body.total_orders :null
    }

    // Check the existence of given email 
    const existUser = await UserModel.findOne({where : {user_email : user.user_email }});

    // If email is already exists then send the message
    if(existUser){
        return res.json({message: "Email is already exists"});
    }

    // Create and save the details in database
    const newUser = await UserModel.create(user);

    // Send the message of success
    res.json({message: "Data inserted successfully"});
});

// Api for Login
router.post("/login" , async (req , res) => {

    // Storing current date and time 
    const currentDate = new Date();

    // Formate the date and time
    const formated =currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // Storing object from request body
    const user = req.body;

    // Find the user in databse by their email
    const existUser = await UserModel.findOne({where : {user_email : user.user_email }});

    // If the user is not exists then return the message
    if(!existUser){
        return res.json({message: "User is not exists"});
    }

    // Compare the hashed password with given password
    const isValidPassword = await bcrypt.compare(user.user_password , existUser.user_password);

    // If the password is not matched then send the message
    if(!isValidPassword){
        return res.json({message: "Incorrct Password"});
    }
    
    // Token creation
    const token = jwt.sign({user_id : existUser.user_id}, "secret");

    // Update the "Last logged in " field in table
    await UserModel.update({last_logged_in : formated} , {where : {user_id : existUser.user_id }});

    // Send the token , customer details and message for success
    res.json({token , data : existUser , message: "Logged in successfully"});
});

// Api for fetching all customers from database
router.get("/" , async (req , res) => {

    // fetch all data 
    const users = await UserModel.findAll({});

    // send the data 
    res.send(users);
});

// Api for fetch a customer details
router.get("/details/:userId" , async (req , res) => {

    // fetch query parameter
    const id = req.params.userId;

    // Check user existence
    const existUser = await UserModel.findOne({where : {user_id : id }});

    // Send the customer details
    res.send(existUser);
});

// Api for fetch individual customer image name
router.get("/image/:userId" , async (req , res) => {

    // fetch query parameter
    const id = req.params.userId;

    // Check user existence
    const existUser = await UserModel.findOne({where : {user_id : id }});

    // Send the name of image
    res.send(existUser.user_image);
});

// Updating the details
router.put("/update",isValidAuth, upload , async (req , res) => {

    // fetch id from body
    const id = req.body.user_id;

    // Check user existence
    const existUser = await UserModel.findOne({where : {user_id : id }});

    // Create object by using request body object
    let user = {
        user_image: req.file ? req.file.filename : existUser.user_image,
        user_email: req.body.user_email,
        user_name: req.body.user_name,
        total_orders : req.body.total_orders !== null ? req.body.total_orders :null,
    }

    // Check new image is set or not if yes then unlink the old one
    if(req.file){
        fs.unlinkSync(`Images/${existUser.user_image}`);
    }

    // Update the customer details
    await UserModel.update(user , {where : {user_id : id }});

    res.send("User details are updated");
});


// Deleting the data of customer
router.delete("/delete/:userId" , async (req , res) => {

    // fetch query parameter
    const id = req.params.userId;

    // Check user existence
    const existUser = await UserModel.findOne({where : {user_id : id }});

    // Unlink the image from the Image folder
    fs.unlinkSync(`Images/${existUser.user_image}`);

    // Delete the user from database
    await UserModel.destroy({where : {user_id : id }});

    res.send("User deleted successfully");
});

module.exports = router;