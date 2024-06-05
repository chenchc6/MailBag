import axios from "axios";
import { config } from "./config";

// Worker class for handling SMTP (Simple Mail Transfer Protocol) operations.
export class Worker {

  /**
   * Sends an email message using SMTP.
   *
   * @param inTo The recipient's email address.
   * @param inFrom The sender's email address, typically configured in the application settings.
   * @param inSubject The subject line of the email message.
   * @param inMessage The body content of the email message.
   */
  public async sendMessage(inTo: string, inFrom: string, inSubject: string, inMessage: string): Promise<void> {
    // Makes an HTTP POST request to the server to send the email.
    // The email data is passed in the request body.
    await axios.post(`${config.serverAddress}/messages`, {
      to: inTo,
      from: inFrom,
      subject: inSubject,
      text: inMessage
    });
  }

}
