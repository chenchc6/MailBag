import axios, { AxiosResponse } from "axios";
import { config } from "./config";

// Interface for Contact with optional _id (present when retrieving or adding contacts).
export interface IContact { _id?: number, name: string, email: string }

// Worker class for performing operations related to contacts.
export class Worker {

  /**
   * Fetches and returns all contacts from the server.
   * 
   * @returns Promise resolving to an array of IContact objects.
   */
  public async listContacts(): Promise<IContact[]> {
    // Makes a GET request to retrieve contacts using axios.
    const response: AxiosResponse = await axios.get(`${config.serverAddress}/contacts`);
    return response.data; // Returns the array of contacts.
  }

  /**
   * Adds a new contact to the server.
   *
   * @param inContact The contact object to add.
   * @returns Promise resolving to the added IContact object, including its _id.
   */
  public async addContact(inContact: IContact): Promise<IContact> {
    // Makes a POST request to add a new contact, sending inContact in the request body.
    const response: AxiosResponse = await axios.post(`${config.serverAddress}/contacts`, inContact);
    return response.data; // Returns the added contact with _id.
  }

  /**
   * Updates an existing contact on the server.
   *
   * @param inContact The contact object to update.
   * @returns Promise resolving to the updated IContact object.
   */
  public async updateContact(inContact: IContact): Promise<IContact> {
    // Makes a PUT request to update the contact, sending inContact in the request body.
    const response: AxiosResponse = await axios.put(`${config.serverAddress}/contacts`, inContact);
    return response.data; // Returns the updated contact.
  }

  /**
   * Deletes a contact from the server based on its ID.
   *
   * @param inID The unique identifier (_id) of the contact to delete.
   * @returns Promise that resolves when the contact is deleted.
   */
  public async deleteContact(inID): Promise<void> {
    // Makes a DELETE request to remove the contact by its _id.
    await axios.delete(`${config.serverAddress}/contacts/${inID}`);
  }

}