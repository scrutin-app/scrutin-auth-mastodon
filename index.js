const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Set up routes

app.get('/', (req, res) => {
  const redirectUri = encodeURIComponent(`https://${req.headers.host}/callback`);
  //const redirectUri = encodeURIComponent(`urn:ietf:wg:oauth:2.0:oob`);
  const scopes = 'read:accounts'//encodeURIComponent('read:accounts');
  const mastodonAuthUrl = `https://${process.env.MASTODON_INSTANCE}/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
  const html = `
    <html>
      <body>
        <h1>Login with Mastodon</h1>
        <p>Click the button to login with your Mastodon account:</p>
        <a href="${mastodonAuthUrl}"><button>Login with Mastodon</button></a>
      </body>
    </html>
  `;
  res.send(html);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `https://${req.headers.host}/callback`;
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: redirectUri
  });

  try {
    const response = await axios.post(`https://${process.env.MASTODON_INSTANCE}/oauth/token`, tokenParams);
    const { access_token: accessToken } = response.data;
    const verifyParams = new URLSearchParams({
      access_token: accessToken
    });
    const verifyResponse = await axios.get(`https://${process.env.MASTODON_INSTANCE}/api/v1/accounts/verify_credentials?${verifyParams}`);
    const { username, display_name, avatar } = verifyResponse.data;
    const html = `
      <html>
        <body>
          <h1>Welcome, ${display_name}!</h1>
          <p>Your username is ${username}.</p>
          <img src="${avatar}" alt="Profile picture">
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

// Start server

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
