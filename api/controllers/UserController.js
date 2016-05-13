/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  signupUser: function (req, res) {
    require('machinepack-passwords').encryptPassword({
      password: req.param('password'),
      difficulty: 10
    }).exec({
      error: function (err){
        console.log(err);
        return res.negotiate(err);
      },

      success: function(encryptedPass) {
        User.create({
          name: req.param('name'),
          title: req.param('title'),
          email: req.param('email'),
          searchHistory: [],
          password: encryptedPass,
          lastLoggedIn: new Date()
        }, function userCreated(err, newUser) {
          if (err && err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
            && err.invalidAttributes.email[0].rule === 'unique') {
            return res.emailAddressInUse();
          }

          req.session.me = newUser.id;
          return res.json(newUser.id);
        });
      }
    });
  },

  signinUser: function(req, res) {
    User.findOne({
      email: req.param('email')
    }).exec(function(err, user) {

      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        return res.notFound('Invalid login credentials.');
      }

      require('machinepack-passwords').checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.password
      }).exec({
        error: function (err){
          return res.negotiate(err);
        },

        // If the password from the form params doesn't checkout w/ the encrypted
        // password from the database...
        incorrect: function (){
          return res.notFound('Invalid login credentials.');
        },

        success: function (){

          // Store user id in the user session
          req.session.me = user.id;

          // All done- let the client know that everything worked.
          return res.ok();
        }
      });
    });
  },

  signoutUser: function(req, res) {
    if (!req.session.me) {
      return res.backToHomePage();
    }

    User.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

    });
  }

};

