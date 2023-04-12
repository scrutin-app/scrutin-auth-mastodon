const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const code = "3x3DRY201srhZrW4CB5yb4HwFSeV9stNSdVqVugvs5Q";
const redirectUri = `https://scrutin-auth-mastodon.fly.dev/callback`;
const tokenParams = {
  grant_type: 'authorization_code',
  code,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: redirectUri
};

let main = async function()  {
  console.log(`https://${process.env.MASTODON_INSTANCE}/oauth/token`);
  const response = await axios.post(`https://${process.env.MASTODON_INSTANCE}/oauth/token`, tokenParams);
  console.log(response)
}

main()
