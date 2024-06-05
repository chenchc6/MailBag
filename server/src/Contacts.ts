// This module manages contact operations like listing, adding, and deleting contacts.
// It uses NeDB, a lightweight JavaScript database, to store contact data.

import * as path from "path";
const Datastore = require("nedb");

// IContact interface: Defines the structure of a contact object.
// The _id field is optional as it is only assigned when retrieving or adding contacts.
export interface IContact {
    _id?: number,
    name: string,
    email: string
}

// Worker class: Handles operations related to contacts using NeDB.
export class Worker {
    // The NeDB Datastore instance for storing contacts.
    private db: Nedb;
    constructor() {
        // Initializing the datastore for contacts with automatic loading.
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"), // Path to the database file.
            autoload: true // Automatically load the database.
        });
    }

    /**
     * Retrieves all contacts from the database.
     *
     * @return Promise that resolves to an array of IContact objects.
     */
    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            // Fetches all records in the contacts database.
            this.db.find(
                {}, // An empty query object fetches all documents.
                (inError: Error, inDocs: IContact[]) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });
    }

    /**
     * Adds a new contact to the database.
     *
     * @param inContact The contact object to add.
     * @return Promise that resolves to the newly added IContact object.
     */
    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            // Inserts the contact into the database.
            // The callback includes the added contact object with an assigned _id field.
            this.db.insert(
                inContact, // The contact object to insert.
                (inError: Error | null, inNewDoc: IContact) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inNewDoc);
                    }
                }
            );
        });
    }

    /**
     * Updates an existing contact in the database.
     *
     * @param inContact The contact object to update.
     * @return Promise that resolves to the updated IContact object.
     */
    public updateContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            // Updates the contact in the database.
            this.db.update(
                { _id: inContact._id }, // Query to match the contact by _id.
                inContact, // The updated contact object.
                { returnUpdatedDocs: true }, // Option to return the updated document.
                (inError: Error | null, numberOfUpdated: number, inDocs: IContact, upsert: boolean) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });
    }

    /**
     * Deletes a contact from the database.
     *
     * @param inID The ID of the contact to delete.
     * @return Promise that resolves upon successful deletion.
     */
    public deleteContact(inID: string): Promise<string | void> {
        return new Promise((inResolve, inReject) => {
            // Removes the contact from the database by its _id.
            this.db.remove(
                { _id: inID }, // Query to match the contact by _id.
                {}, // No options object.
                (inError: Error | null, inNumRemoved: number) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    }

}