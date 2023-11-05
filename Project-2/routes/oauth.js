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
router.get('/auth/github', githubOAuth.authenticate('github', { scope: ['user:email'] }));

// Callback after OAuth authentication
router.get('/auth/github/callback',
  githubOAuth.authenticate('github', { failureRedirect: '/auth/github/error' }), (req, res) => {
    // Successful authentication, redirect to success page
    res.redirect('/auth/github/success');
  }
);

// Successful Login page
router.get('/auth/github/success', oauthController.isAuthenticated, (req, res) => {
  
  res.status(204)
    .set(authParams.title , authParams.success)
    .send('Authentication Successful!');
});

// Failed to login Page.
router.get('/auth/github/error', (req, res) => {
  res.status(500)
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

router.get('/auth/github/signout', (req, res) => {
  try {
    req.session.destroy(function (err){
      //code
    })
    res.status(204).redirect('/api-docs')
  } catch (err){
    res.status(400),send({message: 'Failed to sign out.'})
  }
})

module.exports = router;
