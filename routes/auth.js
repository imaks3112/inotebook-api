const exporess = require("express");
const router = exporess.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post('/createuser',
  [
    body('name', 'Please enter name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password must be 5 charactes.').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      let user = await User.findOne({email: req.body.email});
      if (user) {
        return res.status(400).json({error: 'Email already exist'});
      }
      
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
  
        res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Some error occured');
    }
  }
);

module.exports = router;
