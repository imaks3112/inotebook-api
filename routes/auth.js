const exporess = require("express");
const router = exporess.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'akshay';

// create user
router.post('/createuser',
  [
    body('name', 'Please enter name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be 5 charactes.').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    
    try {
      let user = await User.findOne({email: req.body.email});
      if (user) {
        return res.status(400).json( success, {error: 'Email already exist'});
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      })
  
      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.send({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Some error occured');
    }
  }
);


// Authenticate user.
router.post('/login',
  [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Invalid credentails.').exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
      let user = await User.findOne({email});
      if (!user) {
        success = false;
        return res.status(400).json({success, error: 'Enter correct credentials'});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({success, error: 'Please try to correct credentials'});
      }
  
      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error occured');
    }
  }

);

// getUser user details
router.post('/getUser', fetchuser, async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error occured');
    }
  });


module.exports = router;
