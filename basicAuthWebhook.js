const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000; // Choose a port number that suits your needs

// Middleware to parse JSON request body
app.use(bodyParser.json());

const ZOOM_WEBHOOK_SECRET_TOKEN = "<token>"

// Middleware for Basic Authentication
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    // Compare the username and password with your desired credentials
    if (username === 'abc' && password === 'abc') {
      return next(); // Proceed to the next middleware or route handler
    }
  }

  // Authentication failed, send 401 Unauthorized response
  res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
  res.status(401).send('Unauthorized');
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
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
    console.log('Received webhook:', req.body);

    // Send a response to acknowledge the webhook
    res.sendStatus(200);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Webhook endpoint listening at http://localhost:${port}`);
});
