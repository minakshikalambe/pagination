const path = require("path");

const express = require("express");

const transporter = require("../configs/mail");

const User = require("../models/user.model");

const router = express.Router();

/* 
    body => req.body
    url => req.params
    query string => req.query
*/
router.get("/", async (req, res) => {
  try {
    /* req.query.pagesize = 30 
      req.query.pagesize || 10 returns 30
      req.query.pagesize && 10 returns 10
      
      req.query.pagesize = undefined
      req.query.pagesize || 10 returns 10
      req.query.pagesize && 10 returns undefined
      */

    const page = req.query.page || 1;
    const pagesize = req.query.pagesize || 10; // 30

    // if page = 1 then data should be from 1 to 30
    // if page = 2 then data should be from 31 to 60

    const skip = (page - 1) * pagesize; // 1 - 1 = 0 0 * anything  = 0
    // page = 2 then 2 - 1 = 1 and 1 * pagesize = 30

    const users = await User.find()
      .skip(skip) // 30
      .limit(pagesize) // 31 - 60
      .lean()
      .exec();

    const totalPages = Math.ceil(
      (await User.find().countDocuments()) / pagesize
    );

    return res.status(200).send({ users, users });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    transporter.sendMail({
        from: '"abc admin" <admin@abc.com>', // sender address
        to: user.email, // list of receivers
        subject: `Welcome to ABC system ${user.first_name} ${user.last_name}`, // Subject line
        text: `Hi ${user.first_name}, Please confirm your email address`, // plain text body
        //   html: "<b>Hello sir/madam your product is successfully created</b>", // html body
       
      });

    return res.status(201).send({ message: "Product created successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;