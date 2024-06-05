import axios, { AxiosResponse } from "axios";
import { config } from "./config";

// IMailbox interface: Represents the structure of a mailbox.
export interface IMailbox { name: string, path: string }

// IMessage interface: Represents the structure of a message, including an optional body.
export interface IMessage {
  id: string,
  date: string,
  from: string,
  subject: string,
  body?: string // Optional as the body isn't sent when listing messages.
}

// Worker class: Handles IMAP operations for the MailBag application.
export class Worker {

  /**
   * Fetches and returns a list of all top-level mailboxes from the server.
   *
   * @return Promise resolving to an array of IMailbox objects.
   */
  public async listMailboxes(): Promise<IMailbox[]> {
    const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes`);
    return response.data; // Returns the array of mailbox objects.
  }

  /**
   * Fetches and returns a list of messages in a specified mailbox.
   *
   * @param inMailbox The name of the mailbox to retrieve messages from.
   * @return Promise resolving to an array of IMessage objects.
   */
  public async listMessages(inMailbox: string): Promise<IMessage[]> {
    const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes/${inMailbox}`);
    return response.data; // Returns the array of messages.
  }

  /**
   * Fetches and returns the body of a specific message.
   *
   * @param inID The ID of the message to retrieve the body of.
   * @param inMailbox The mailbox path where the message resides.
   * @return Promise resolving to the message body as a string.
   */
  public async getMessageBody(inID: string, inMailbox: String): Promise<string> {
    const response: AxiosResponse = await axios.get(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
    return response.data; // Returns the message body.
  }

  /**
   * Deletes a specified message from a mailbox.
   *
   * @param inID The ID of the message to be deleted.
   * @param inMailbox The mailbox path where the message resides.
   * @return Promise that resolves when the message is deleted.
   */
  public async deleteMessage(inID: string, inMailbox: String): Promise<void> {
    await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
  }

}