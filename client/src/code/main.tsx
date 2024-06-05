// Main entry point of the application.
import "normalize.css"; // Applies a CSS reset to enhance cross-browser consistency.
import "../css/main.css"; // Custom CSS for styling the application.

import React from "react";
import ReactDOM from "react-dom";
import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";

// Render the BaseLayout component at the root of the application.
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);

// Show a loading indicator while data is being fetched.
baseComponent.state.showHidePleaseWait(true); // Activating the 'please wait' state in the BaseLayout component.

// Function to fetch mailboxes from the server.
async function getMailboxes() {
  const imapWorker: IMAP.Worker = new IMAP.Worker();
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
  // Update the application state with the fetched mailboxes.
  mailboxes.forEach((inMailbox) => {
    baseComponent.state.addMailboxToList(inMailbox);
  });
}

// Fetching mailboxes and then contacts from the server.
getMailboxes().then(function() {
  // Function to fetch contacts after mailboxes are retrieved.
  async function getContacts() {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    // Update the application state with the fetched contacts.
    contacts.forEach((inContact) => {
      baseComponent.state.addContactToList(inContact);
    });
  }
  // Fetch contacts and then hide the loading indicator.
  getContacts().then(() => baseComponent.state.showHidePleaseWait(false));
});