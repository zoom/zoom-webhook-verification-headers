require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000;

app.use(bodyParser.json());
const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN

//generate a random string
let access_token = Math.random().toString(36).substr(2);

let currentAccess_token = `Bearer ${access_token}`


app.post('/oauth/token', (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(access_token)

  //decode the value of clientID and clientSecret in the header
  if (authHeader) {
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const clientId = auth[0];
    const clientSecret = auth[1];

    //Print the values of clientID and clientSecret
    console.log('Incoming Client_Id from Zoom', clientId);
    console.log('Incoming Client_Secret from Zoom:', clientSecret);

    //If the values match then provide zoom with an access token
    if (clientId === process.env.webhook_client_id && clientSecret === process.env.webhook_client_secret) {
      const responseJson = {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": "3599"
      };
      console.log("Incoming request verified. Successfully sent Access Token to Zoom")
      return res.status(200).json(responseJson);

    }
  }
  else {
    res.status(401).send('Unauthorized');
    console.log("Zoom Verification Failed")
  }
});


app.post('/webhook1', (req, res) => {
  const webhookEvent = req.body.event;
  const zoomAuthHeader = req.headers.authorization;

  //check if the value of access token matches in the webhook authorization header
  if (zoomAuthHeader === currentAccess_token) {
    // Handle other webhook events here
    console.log('Verified Webhook Header', req.headers);
    console.log('Verified Webhook Payload', req.body);

    // Send a response to acknowledge the webhook
    res.sendStatus(200);
  }

  // Validating the Webhook Endpoint URL
  if (zoomAuthHeader === currentAccess_token & webhookEvent === 'endpoint.url_validation') {
    const plainToken = req.body.payload.plainToken;
    const hashedToken = crypto.createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
      .update(plainToken)
      .digest('hex');

    const responseJson = {
      plainToken: plainToken,
      encryptedToken: hashedToken
    };

    res.status(200).json(responseJson);

    console.log(`Webhook Endpoint URL validated by Zoom`);
  }
  else {
    console.log('Unverified Header:', req.headers);
    console.log('Unverified Body:', req.body)
    return res.status(401).send('Unauthorized');

  }
});

app.listen(port, () => {
  console.log(`Webhook endpoint listening at http://localhost:${port}`);
});
