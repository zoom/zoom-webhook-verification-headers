require ('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000;

app.use(bodyParser.json());

const ZOOM_WEBHOOK_SECRET_TOKEN = process.env.ZOOM_WEBHOOK_SECRET_TOKEN
let access_token = Math.random().toString(36).substr(2);
let currentAccess_token =`Bearer ${access_token}`


app.post('/oauth/token', (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Generate a random alphanumeric string
    

    console.log(access_token)
  
    if (authHeader) {
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const clientId = auth[0];
      const clientSecret = auth[1];
  
      console.log('Incoming Client_Id from Zoom', clientId);
      console.log('Incoming Client_Secret from Zoom:', clientSecret);
  
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
  
    res.status(401).send('Unauthorized');
    console.log("Zoom Verification Failed")
  });
  
  

  app.post('/webhook1', (req, res) => {
    const webhookEvent = req.body.event;
    const zoomAuthHeader = req.headers.authorization;
   
    if (zoomAuthHeader !== currentAccess_token){
        console.log('Unverified Header:', req.headers);
        console.log('Unverified Body:', req.body)
    return res.status(401).send('Unauthorized');
  }
    
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
  }
   else  {
      // Handle other webhook events here
      console.log('Verified Webhook Header', req.headers);
      console.log('Verified Webhook Payload', req.body);
  
      // Send a response to acknowledge the webhook
      res.sendStatus(200);
    }
  });

app.listen(port, () => {
  console.log(`Webhook endpoint listening at http://localhost:${port}`);
});
