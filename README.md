# MailBag

MailBag is a single-user webmail application that supports IMAP for receiving emails and SMTP for sending emails. The application also includes functionality for managing contacts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Configuration](#configuration)

## Installation

To set up the MailBag application, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd mailbag
    ```

2. **Install dependencies for both the client and server:**

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Build the client application:**

    ```bash
    cd client
    npm run build
    ```

4. **Start the server:**

    ```bash
    cd ../server
    npm start
    ```

The server will start on port 80 by default.

## Usage

Once the server is running, you can access the MailBag webmail application by navigating to `http://localhost` in your web browser.


## Configuration

The server configuration is stored in the `server/serverInfo.json` file. This file contains the necessary details for connecting to the IMAP and SMTP servers:

```json
{
  "smtp": {
    "server": "smtp.example.com",
    "port": 587,
    "user": "smtp_user",
    "pass": "smtp_password",
    "from": "from_address@example.com"
  },
  "imap": {
    "server": "imap.example.com",
    "port": 993,
    "user": "imap_user",
    "pass": "imap_password"
  }
}
