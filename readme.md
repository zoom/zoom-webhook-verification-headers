# Zoom Webhook Authentication Servers

This guide will help you set up three different Express servers that implement distinct types of authentication: Basic Authentication, Token Authentication, and Custom Header Authentication. Each server responds to a specific webhook event named 'endpoint.url_validation'. The servers will verify incoming requests based on their respective authentication method and either proceed with the request or return a 401 Unauthorized response.

Each server also handles a specific Zoom webhook event, 'endpoint.url_validation', which is a token validation process. In response, the server sends back the original token and an encrypted version. For encryption, a secret token from the Zoom Marketplace is required.

## Prerequisites
Ensure you have the following:

1. Node.js (12.x or higher) - you can check your version with the command `node -v`
2. NPM (6.x or higher) - check the version using `npm -v`

## Installation and Setup
1. Copy the code into a new directory on your local machine. 
2. Open a terminal window, navigate to the new directory.
3. Install the required Node.js modules by running the following command: 

```bash
npm install express body-parser crypto dotenv
```
   
## Configuration
Each server requires specific environment variables to function correctly. For this, create a `.env` file in the root directory of your project and specify your variables as shown:

```bash
ZOOM_WEBHOOK_SECRET_TOKEN= <Your_Value>

// For Basic Auth option:
USERNAME = <Your_Value>
PASSWORD = <Your_Value>

// For Token Auth
webhook_client_id = <Your_Value>
webhook_client_secret = <Your_Value>

//For custom Headers
Zoom_Webhook_Custom_Key = <Your_Value>
Zoom_Webhook_Custom_Secret = <Your_Value>
```

Make sure to replace `<Your_Value>` placeholders with your actual data.

## Running the Servers
To start a server, use the following command in the terminal:

```bash
node <server_filename>.js
```

Replace `<server_filename>` with either `BasicAuth`, `TokenAuth`, or `CustomHeader` depending on which server you want to run.

If the server starts successfully, you'll see the following message:

```bash
Webhook endpoint listening at http://localhost:4000
```

## Usage
The server will now be running at [http://localhost:4000](http://localhost:4000) and ready to accept POST requests at the respective endpoint (`/webhook3`, and `/webhook1`, or `/webhook`).

The server will respond to an event named `endpoint.url_validation` in the request body. Upon receiving this event, the server responds with a JSON object containing the original token and its hashed version, verifying the integrity of the token. 

For any other event types, the server logs the request headers and body, then sends a 200 OK response. These events are received successfully, and you can extend this functionality to handle other specific events as needed. 

When making a request, ensure to include the appropriate authentication details corresponding to the server:

- For `BasicAuth.js`, include an 'Authorization' header with 'Basic' followed by base64-encoded 'username:password'.
- For `TokenAuth.js`, include an 'Authorization' header with 'Bearer' followed by the access token.
- For `CustomHeader.js`, include a custom header whose key and value match those specified in the `.env` file.
