const express = require('express'); 
const router = express.Router(); 
const gravatar = require('gravatar'); 
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

//@route        POST api/users
//@description  Register user
//@access       Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    
    const { name, email, password } = req.body; 

    try {
      let user = await User.findOne({ email})

      // See if user exists 
      if (user) {
        return res.status(400).json({ errors: [{ message: 'User already exists' }] })
      }

      // Get users gravatar based on their email 
      const avatar = gravatar.url(email, {
        s: '200', 
        r: 'pg', 
        d: 'mm'
      })

      // creating a new user instance from user model schema 
      user = new User({
        name, 
        email, 
        avatar, 
        password
      }); 

      // Encrypt password using bcrypt 
      const salt = await bcrypt.genSalt(10)
      user.password  = await bcrypt.hash(password, salt)

      // Save user to DB
      await user.save()

      // Return JSON web token 

      res.send("User registered");

    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server error')
    }

    
  }
);

module.exports = router; 