// This module facilitates communication with an SMTP server to send email messages.

import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { IServerInfo } from "./ServerInfo";

// Worker class: Manages SMTP operations for sending emails.
export class Worker {
    // Holds the SMTP server configuration.
    private static serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        // Initializes the worker with server information.
        Worker.serverInfo = inServerInfo;
    }

    /**
     * Sends an email message using SMTP.
     *
     * @param inOptions An object with email details like to, from, subject, and text.
     *                  This follows the structure required by nodemailer.
     * @return A Promise resolving to null for success, or an error message string for failure.
     */
    public sendMessage(inOptions: SendMailOptions): Promise<string | void> {
        // Wraps nodemailer's sendMail in a Promise to enable async/await syntax.
        return new Promise((inResolve, inReject) => {
            // Creates a transport instance with SMTP server details.
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            // Sends the email with the provided details.
            transport.sendMail(
                inOptions, // The email content and recipient details.
                (inError: Error | null, inInfo: SentMessageInfo) => {
                    if (inError) {
                        // In case of an error, the Promise is rejected.
                        inReject(inError);
                    } else {
                        // On success, the Promise is resolved.
                        inResolve();
                    }
                }
            );
        });
    }
}
