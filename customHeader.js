require ('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000; // Choose a port number that suits your needs

// Middleware to parse JSON request body
app.use(bodyParser.json());
const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN

// Middleware for Custom Header Authentication
app.use((req, res, next) => {
  const customHeaderKey = process.env.Zoom_Webhook_Custom_Key;
  const customHeaderValue = req.headers[customHeaderKey];

  // Check if the custom header value matches
  if (customHeaderValue === process.env.Zoom_Webhook_Custom_Secret) {
    console.log('Verified Header', req.headers)
    console.log('Verified webhook:', req.body);
    return next(); // Proceed to the next middleware or route handler
    
  }

  if (customHeaderValue !== process.env.Zoom_Webhook_Custom_Secret) {
    console.log('Unverified Header', req.headers)
  console.log('Unverified webhook:', req.body);
 // Authentication failed, send 401 Unauthorized response
  res.status(401).send('Unauthorized');
  }
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

      console.log(`Webhook Endpoint URL validated by Zoom`);
    } else {
  
      // Send a response to acknowledge the webhook
      res.sendStatus(200);
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Webhook endpoint listening at http://localhost:${port}`);
});
