const jwtSecret = 'securePassword123'; // This has to be the same key used in JWTStrategy

const jwt = require('jsonwebtoken');
const passport = require('passport');
const Models = require('./models.js');
const bcrypt = require('bcrypt');

let Users = Models.Users;

// Generate JWT Token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you're encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values of the JWT
  });
};

/* Register a new user */
module.exports = (app) => {
  app.post('/register', async (req, res) => {
    const { username, password, email, birthday } = req.body;

    try {
      // Check if username already exists
      const existingUser = await Users.findOne({ Username: username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }

      // Create new user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new Users({
        Username: username,
        Password: hashedPassword,
        Email: email,
        Birthday: birthday
      });

      await newUser.save();
      res.status(201).send('User registered succesfully');
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  });

  /* Login user */
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findOne({ Username })
      .then((user) => {
        if (!user) {
          return res.status(400).send('Username does not exist');
        }

        // Validate entered password with the hashed password
        bcrypt.compare(password, user.Password)
        user.validatePassword(Password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).send('Password is incorrect');
            }

            // Generate JWT if password matches
            const token = generateJWTToken(user.toJSON());
            res.json({ user, token });
          })
          .catch((err) => res.status(500).send('Error: ' + err));
      })
      .catch((err) => res.status(500).send('Error: ' + err));
  });
};

/* POST login using Passport */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
