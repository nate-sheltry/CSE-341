const express = require('express');
const router = express.Router();
const githubOAuth = require('../oauth/oauth');
const oauthController =  require('../controllers/oauth');

const authParams = {
  title:'Authentication',
  success:'succeeded',
  failed:'failed',
  pending:'pending'
};

// Initiate OAuth authentication
router.get('/auth/github', (req, res) => {
  const clientId = req.query.client_id;

  // Check if the client ID is provided in the query parameters
  if (clientId != process.env.GITHUB_CLIENT_ID) {
    return res.status(400).send('Client ID is incorrect. Please <a href="/api-docs/">login with Github</a>.');
  }

  // Use the provided client ID for authentication
  githubOAuth.authenticate('github', { scope: ['user:email'] })(req, res);
});

// Callback after OAuth authentication
router.get('/auth/github/callback',
  githubOAuth.authenticate('github', { failureRedirect: '/auth/github/error' }),
  function(req, res) {
    // Successful authentication, redirect to success page
    res.redirect('/auth/github/success');
  }
);

// Successful Login page
router.get('/auth/github/success', oauthController.isAuthenticated, (req, res) => {
  
  res
    .set(authParams.title , authParams.success)
    .send('Authentication Successful!');
});

// Failed to login Page.
router.get('/auth/github/error', (req, res) => {
  res
    .set(authParams.title , authParams.failed)
    .send('An Error has occurred, please try again, <a href="/api-docs/">login with Github</a>.');
});

// Failure to Authenticate API Access.
router.get('/authentication-failed', (req, res) => {
  res
    .status(401)
    .set(authParams.title , authParams.failed)
    .send('Error, failed to authenticate, please <a href="/api-docs/">login with Github</a>.');
});

module.exports = router;
