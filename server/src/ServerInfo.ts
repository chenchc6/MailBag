// This configuration module provides the necessary details for IMAP and SMTP server connections.
// It reads the server information from a file and makes it available for use in the application.

// Importing Node's path module to handle file paths.
const path = require("path");
// Importing Node's File System module to read files.
const fs = require("fs");

// IServerInfo interface: Describes the structure for SMTP and IMAP server configuration.
export interface IServerInfo {
    smtp: {
        host: string, // SMTP server host address.
        port: number, // SMTP server port number.
        auth: { // Authentication details for SMTP.
            user: string, // SMTP username.
            pass: string // SMTP password.
        }
    },
    imap: {
        host: string, // IMAP server host address.
        port: number, // IMAP server port number.
        auth: { // Authentication details for IMAP.
            user: string, // IMAP username.
            pass: string // IMAP password.
        }
    }
}

// serverInfo: Holds the configuration for the SMTP and IMAP servers.
export let serverInfo: IServerInfo;

// Reading the server configuration from a JSON file and parsing it.
// The serverInfo.json file contains the configuration for connecting to the SMTP and IMAP servers.
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);
// After parsing, serverInfo is an object that contains the necessary details to connect to the servers.
// This setup is designed for MailBag, a single-user webmail application.