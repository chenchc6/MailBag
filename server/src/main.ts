// This module is the main entry point for the server application. 
// It sets up the Express server and defines the API endpoints for client-server communication.

import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";

import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

// Create an Express application instance.
const app: Express = express();

// Middleware to parse JSON bodies in incoming requests.
app.use(express.json());

// Middleware to serve static files (client application) from the 'dist' directory.
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes.
// This allows the API to be called from web pages hosted on different domains.
app.use(function (inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});

// Define RESTful API endpoints:

// Endpoint to list all mailboxes.
app.get("/mailboxes", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
        inResponse.status(200).json(mailboxes);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to list messages in a specific mailbox.
app.get("/mailboxes/:mailbox", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messages: IMAP.IMessage[] = await imapWorker.listMessages({ mailbox: inRequest.params.mailbox });
        inResponse.status(200).json(messages);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to get the body of a specific message.
app.get("/messages/:mailbox/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messageBody: string = await imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.status(200).send(messageBody);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to delete a specific message.
app.delete("/messages/:mailbox/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.status(200).send("ok");
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to send a message.
app.post("/messages", async (inRequest: Request, inResponse: Response) => {
    try {
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
        await smtpWorker.sendMessage(inRequest.body);
        inResponse.status(201).send("ok");
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to list all contacts.
app.get("/contacts", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contacts: IContact[] = await contactsWorker.listContacts();
        inResponse.status(200).json(contacts);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to add a new contact.
app.post("/contacts", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.addContact(inRequest.body);
        inResponse.status(201).json(contact);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to update an existing contact.
app.put("/contacts", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: IContact = await contactsWorker.updateContact(inRequest.body);
        inResponse.status(202).json(contact);
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Endpoint to delete a specific contact.
app.delete("/contacts/:id", async (inRequest: Request, inResponse: Response) => {
    try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(inRequest.params.id);
        inResponse.status(200).send("ok");
    } catch (inError) {
        inResponse.status(400).send("error");
    }
});

// Start the Express server.
app.listen(80, () => {
    console.log("MailBag server open for requests");
});