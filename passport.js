const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');

 let Users = Models.Users,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Local Strategy for username/password login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      try {
        // Find user by username
        const user = await Users.findOne({ Username: username });

        if (!user) {
          console.log('Incorrect username');
          return callback(null, false, 
            { message: 'Incorrect username or password'});
      }

        // Compare provided password with hashed password
        const isValidPassword = await bcrypt.compare(password, user.Password);
        if (!isValidPassword) {
          console.log('Incorrect password');
          return callback(null, false, 
            { message: 'Incorrect username or password',
          });
        }
      
        // If password matches, return the user object
        console.log('Authentication succesful');
        return callback(null, user);
      } catch (error) { 
        console.log(error);
        return callback(error);
      }
    }
  )
);

// JWT Strategy for veryfying tokens
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'securePassword123',     
    }, 
    async (jwtPayload, callback) => {
      try {
        const user = await Users.findById(jwtPayload._id);
        if (user) {
          return callback(null, user);
        } else {
        return callback(null, false, { message: 'User not found' });
        }
      } catch (error) {
      return callback(error);
    }
  }
  )
);

module.exports = passport;

