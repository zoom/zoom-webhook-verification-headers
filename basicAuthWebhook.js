require ('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000; // Choose a port number that suits your needs

// Middleware to parse JSON request body
app.use(bodyParser.json());
const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN

// Middleware for Basic Authentication
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const authSplit = authHeader.split(' ');
    // Check if authSplit[1] exists before creating Buffer
    if (authSplit.length > 1 && authSplit[1]) {
      const auth = Buffer.from(authSplit[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];

      // Compare the username and password with your desired credentials
      if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        return next(); // Proceed to the next middleware or route handler
      }

      if (username !== process.env.USERNAME || password !== process.env.PASSWORD){
        console.log('Unverified Header:', req.headers);
        console.log('Unverified Body:', req.body)
      }
    }
  }

  // Authentication failed, send 401 Unauthorized response
  res.status(401).send('Unauthorized');
  console.log("Zoom Verification Failed")
});

// Webhook endpoint
app.post('/webhook3', (req, res) => {
  const webhookEvent = req.body.event;

  if (webhookEvent === 'endpoint.url_validation') {
    const plainToken = req.body.payload.plainToken;
    const hashedToken = crypto.createHmac('sha256', ZOOM_WEBHOOK_SECRET_TOKEN)
                            .update(plainToken)
                            .digest('hex');
    
    const responseJson = {
      plainToken: plainToken,
      encryptedToken: hashedToken
    };
    
    res.status(200).json(responseJson);
  } else {
    // Handle other webhook events here
    console.log('Verified Webhook Header', req.headers);
    console.log('Verified Webhook Payload', req.body);

    // Send a response to acknowledge the webhook
    res.sendStatus(200);
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Webhook endpoint listening at http://localhost:${port}`);
});
