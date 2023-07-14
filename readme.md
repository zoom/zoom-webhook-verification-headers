# Basic Authentication Webhook Server with Node.js and Express

This readme will guide you through setting up a basic Express server that uses Basic Authentication and responds to a specific webhook event named 'endpoint.url_validation'. The server takes a request, checks the Basic Authentication credentials from the Authorization header, and either allows the request to proceed or returns a 401 Unauthorized response.

The server also handles a specific Zoom webhook event, 'endpoint.url_validation'. This is a token validation process, in which the server responds with the original token as well as an encrypted version. This requires a secret token from the Zoom Marketplace.

## Prerequisites
Make sure you have the following:

1. Node.js (12.x or higher) - you can check your version with the command `node -v`
2. NPM (6.x or higher) - check the version using `npm -v`

## Installation and Setup
1. Copy the code into a new directory on your local machine. 
2. Open a terminal window, navigate to the new directory.
3. Install the required Node.js modules by running the following command: 

```bash
npm install express body-parser crypto
```
   
## Configuration
In the server code, replace the `<token>` with your Zoom Marketplace secret token. This token is used for creating a hash of the plaintext token.

```javascript
const ZOOM_WEBHOOK_SECRET_TOKEN = "<token>"
```

The server checks the username and password sent in the Authorization header against a set username and password ('abc', 'abc' by default). If the username and password match, the request is allowed to proceed. If they don't match, a 401 Unauthorized response is returned. Change these credentials as per your needs.

```javascript
if (username === 'abc' && password === 'abc') {
  return next();
}
```

## Running the Server
Run the following command in the terminal to start the server:

```bash
node app.js
```

If the server starts successfully, you will see the following message:

```bash
Webhook endpoint listening at http://localhost:4000
```

## Usage
The server should now be running at [http://localhost:4000](http://localhost:4000) and ready to accept POST requests at the `/webhook` endpoint. 

The server will look for an event named `endpoint.url_validation` in the request body. Upon receiving this event, the server responds with a JSON object containing the original token and its hashed version, verifying the integrity of the token. 

For any other event types, the server logs the request body and sends a 200 OK response. These events are received successfully, and you can extend this functionality to handle other specific events as needed. 

Remember to include the Basic Authentication credentials that match the username and password in the server code while making a request.