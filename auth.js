/**
 * Secret key used for signing JWT tokens.
 * This must be the same key used in JWTStrategy.
 * @constant {string}
 */
const jwtSecret = 'securePassword123';

const jwt = require('jsonwebtoken');
const passport = require('passport');
const Models = require('./models.js');
const bcrypt = require('bcrypt');

let Users = Models.Users;

/**
 * Generates a JWT token for the authenticated user.
 *
 * @param {Object} user - The user object containing user details.
 * @returns {string} - The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Encodes the username in the JWT
    expiresIn: '7d', // Token expires in 7 days
    algorithm: 'HS256' // HS256 algorithm is used to sign the JWT
  });
};

/**
 * Registers a new user.
 *
 * @param {Object} app - The Express application instance.
 */
module.exports = (app) => {
  /**
   * Registers a new user by checking for existing username, hashing the password, and saving the user.
   *
   * @name RegisterUser
   * @route {POST} /register
   * @param {Object} req - The request object containing user details.
   * @param {Object} res - The response object.
   */
  app.post('/register', async (req, res) => {
    const { username, password, email, birthday } = req.body;

    try {
      // Check if username already exists
      const existingUser = await Users.findOne({ Username: username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new Users({
        Username: username,
        Password: hashedPassword,
        Email: email,
        Birthday: birthday
      });

      await newUser.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  });

  /**
   * Logs in a user by validating the username and password.
   *
   * @name LoginUser
   * @route {POST} /login
   * @param {Object} req - The request object containing username and password.
   * @param {Object} res - The response object.
   */
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findOne({ Username: username })
      .then((user) => {
        if (!user) {
          return res.status(400).send('Username does not exist');
        }

        // Validate entered password against the stored hashed password
        bcrypt.compare(password, user.Password)
        user.validatePassword(password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).send('Password is incorrect');
            }

            // Generate JWT token if password is correct
            const token = generateJWTToken(user.toJSON());
            res.json({ user, token });
          })
          .catch((err) => res.status(500).send('Error: ' + err));
      })
      .catch((err) => res.status(500).send('Error: ' + err));
  });
};

/**
 * Logs in a user using Passport authentication.
 *
 * @param {Object} router - The Express router instance.
 */
module.exports = (router) => {
  /**
   * Logs in a user using the Passport local strategy.
   *
   * @name PassportLogin
   * @route {POST} /login
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
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
