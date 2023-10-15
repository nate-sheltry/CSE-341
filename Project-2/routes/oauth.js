const express = require('express');
const router = express.Router();
const githubOAuth = require('../oauth/oauth');

const authParams = {
  title:'Authentication',
  success:'succeeded',
  failed:'failed',
  pending:'pending'
};

// Initiate OAuth authentication
router.get('/auth/github',
  githubOAuth.authenticate('github', { scope: ['user:email'] })
);

// Callback after OAuth authentication
router.get('/auth/github/callback',
  githubOAuth.authenticate('github', { failureRedirect: '/auth/github/error' }),
  function(req, res) {
    // Successful authentication, redirect to success page
    res.redirect('/auth/github/success');
  }
);

// Successful Login page
router.get('/auth/github/success', (req, res) => {
  
  res
    .set(authParams.title , authParams.success)
    .send('Authentication Successful! <a href="/api-docs">Return to live documentation</a>');
});

// Failed to login Page.
router.get('/auth/github/error', (req, res) => {
  res
    .set(authParams.title , authParams.failed)
    .send('An Error has occurred, please try again, <a href="/auth/github">login with Github</a>.');
});

// Failure to Authenticate API Access.
router.get('/authentication-failed', (req, res) => {
  res
    .status(401)
    .set(authParams.title , authParams.failed)
    .send('Error, failed to authenticate, please <a href="/auth/github">login with Github</a>.');
});

module.exports = router;
