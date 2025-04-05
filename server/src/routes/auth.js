// Reference: https://github.com/passport/todos-express-google-oauth2

var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");
var { pool } = require("../db");
var { CLIENT_URL } = require("../const");

// Configure the Google strategy for use by Passport.
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
      state: true,
    },

    // TODO: Manually added these tables. Add to automatic migrations
    /**
   *
  CREATE TABLE IF NOT EXISTS federated_credentials (
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      subject TEXT NOT NULL,
      PRIMARY KEY (provider, subject)
  );


  CREATE TABLE IF NOT EXISTS public.session
  (
      sid character varying COLLATE pg_catalog."default" NOT NULL,
      sess json NOT NULL,
      expire timestamp(6) without time zone NOT NULL,
      CONSTRAINT session_pkey PRIMARY KEY (sid)
  )

  --------------
  -- Step 1: Create the sequence
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Step 2: Create the users table
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Step 3: Set the owner of the table
ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
   */

    function (accessToken, refreshToken, profile, cb) {
      pool.query(
        "SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2",
        ["https://accounts.google.com", profile.id],
        function (err, federatedCredentialsResult) {
          if (err) {
            return cb(err);
          }
          if (
            !(federatedCredentialsResult && federatedCredentialsResult.rowCount)
          ) {
            pool.query(
              "INSERT INTO users (name) VALUES ($1) RETURNING Id",
              [profile.displayName],
              function (err, result) {
                if (err) {
                  return cb(err);
                }
                var user_id = result.rows[0].id;
                pool.query(
                  "INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)",
                  [user_id, "https://accounts.google.com", profile.id],
                  function (err) {
                    if (err) {
                      return cb(err);
                    }
                    var user = {
                      id: user_id,
                      name: profile.displayName,
                    };
                    return cb(null, user);
                  },
                );
              },
            );
          } else {
            row = federatedCredentialsResult.rows[0];
            pool.query(
              "SELECT id FROM users WHERE id = $1",
              [row.user_id],
              function (err, userResult) {
                if (err) {
                  return cb(err);
                }
                if (!userResult) {
                  return cb(null, false);
                }
                row = userResult.rows[0];
                user = { id: row.id, name: profile.displayName };
                return cb(null, user);
              },
            );
          }
        },
      );
    },
  ),
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var authRouter = express.Router();

/* GET /login
 *
 * This route prompts the user to log in.
 *
 * The 'login' view renders an HTML page, which contain a button prompting the
 * user to sign in with Google.  When the user clicks this button, a request
 * will be sent to the `GET /login/federated/accounts.google.com` route.
 */

// authRouter.get("/login", function (req, res, next) {
//   res.redirect(`${CLIENT_URL}/login`);
// });

authRouter.get("/success", function (req, res, next) {
  res.redirect(`${CLIENT_URL}/`);
});

// Route to get current authenticated user
authRouter.get("/current-user", (req, res) => {
  res.send(req.user ? req.user : null);
});

/* GET /login/federated/accounts.google.com
 *
 * This route redirects the user to Google, where they will authenticate.
 *
 * Signing in with Google is implemented using OAuth 2.0.  This route initiates
 * an OAuth 2.0 flow by redirecting the user to Google's identity server at
 * 'https://accounts.google.com'.  Once there, Google will authenticate the user
 * and obtain their consent to release identity information to this app.
 *
 * Once Google has completed their interaction with the user, the user will be
 * redirected back to the app at `GET /oauth2/redirect/accounts.google.com`.
 */
authRouter.get("/login/federated/google", passport.authenticate("google"));

/*
    This route completes the authentication sequence when Google redirects the
    user back to the application.  When a new user signs in, a user account is
    automatically created and their Google account is linked.  When an existing
    user returns, they are signed in to their linked account.
*/
authRouter.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/success",
    failureRedirect: "/login",
  }),
);

/* POST /logout
 *
 * This route logs the user out.
 */
authRouter.post("/logoutuser", function (req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.send({ success: true });
  });
});
module.exports = authRouter;
