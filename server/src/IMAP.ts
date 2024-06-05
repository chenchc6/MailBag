// This module facilitates communication with an IMAP server for mailbox and message operations.

import { ParsedMail } from "mailparser";
import { simpleParser } from "mailparser";
const ImapClient = require("emailjs-imap-client");
import { IServerInfo } from "./ServerInfo";

// ICallOptions interface: Describes the parameters needed for IMAP calls.
// Required for all mailbox-related operations; message ID is needed only for specific message operations.
export interface ICallOptions {
    mailbox: string,
    id?: number
}

// IMessage interface: Defines the structure of a message retrieved from the IMAP server.
// The body is optional as it's not included in message listings.
export interface IMessage {
    id: string,
    date: string,
    from: string,
    subject: string,
    body?: string
}

// IMailbox interface: Defines the structure of a mailbox.
// The path is used for identifying a mailbox in various operations.
export interface IMailbox {
    name: string,
    path: string
}

// Disabling certificate validation - necessary for compatibility with certain IMAP servers, but reduces security.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Worker class: Performs IMAP operations and interacts with the main application.
export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        // Stores the provided server information for later use in IMAP operations.
        Worker.serverInfo = inServerInfo;
    }

    /**
     * Establishes a connection to the IMAP server.
     *
     * @return A Promise resolving to an ImapClient instance.
     */
    private async connectToServer(): Promise<any> {
        // Creates a new IMAP client with the server information.
        const client: any = new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            { auth: Worker.serverInfo.imap.auth }
        );
        client.logLevel = client.LOG_LEVEL_NONE; // Suppresses logging for cleaner output.
        client.onerror = (inError: Error) => {
            // Logs connection errors without retry attempts.
            console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
        };
        await client.connect();
        return client;
    }

    /**
     * Retrieves a list of all top-level mailboxes from the IMAP server.
     *
     * @return A Promise resolving to an array of IMailbox objects.
     */
    public async listMailboxes(): Promise<IMailbox[]> {
        // Connects to the server and fetches the mailbox list.
        const client: any = await this.connectToServer();
        const mailboxes: any = await client.listMailboxes();
        await client.close();

        // Transforms the mailbox list from the IMAP client format to the application's format.
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inArray: any[]): void => {
            // Adds each mailbox to the final list, including nested mailboxes via recursion.
            inArray.forEach((inValue: any) => {
                finalMailboxes.push({ name: inValue.name, path: inValue.path });
                iterateChildren(inValue.children);
            });
        };
        iterateChildren(mailboxes.children);
        return finalMailboxes;
    }

    /**
     * Lists basic information about messages in a specified mailbox.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     * @return A Promise resolving to an array of IMessage objects.
     */
    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {
        const client: any = await this.connectToServer();
        // Selects the mailbox to retrieve the message count.
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        
        // If there are no messages, returns an empty array.
        if (mailbox.exists === 0) {
            await client.close();
            return [];
        }

        // Retrieves message information, ordered by UID (First In, First Out).
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            "1:*",
            ["uid", "envelope"]
        );
        await client.close();

        // Transforms the message list to the application's format.
        const finalMessages: IMessage[] = [];
        messages.forEach((inValue: any) => {
            finalMessages.push({
                id: inValue.uid,
                date: inValue.envelope.date,
                from: inValue.envelope.from[0].address,
                subject: inValue.envelope.subject
            });
        });
        return finalMessages;
    }

    /**
     * Retrieves the plain text body of a specific message.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     * @return A Promise resolving to the plain text body of the message.
     */
    public async getMessageBody(inCallOptions: ICallOptions): Promise<string> {
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id,
            ["body[]"],
            { byUid: true }
        );
        // Parses the message body into a readable format.
        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);
        await client.close();
        return parsed.text!;
    }

    /**
     * Deletes a specific message from the mailbox.
     *
     * @param inCallOptions An object implementing the ICallOptions interface.
     */
    public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id,
            ["uid"],
            { byUid: true }
        );
        // Moves the message to the 'Deleted' mailbox before actual deletion.
        if (inCallOptions.mailbox !== 'Deleted'){
            await client.copyMessages(
                inCallOptions.mailbox,
                messages[0]['uid'],
                'Deleted',
                { byUid: true }
            );
        }
        // Deletes the specified message.
        await client.deleteMessages(
            inCallOptions.mailbox,
            messages[0]['uid'],
            { byUid: true }
        );
        await client.close();
    }

}