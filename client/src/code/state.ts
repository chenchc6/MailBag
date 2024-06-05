import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";

/**
 * This function initializes and returns the state object for the BaseLayout component.
 * It should be called once during the component's initialization.
 * 
 * @param inParentComponent The parent component that this state is associated with.
 * @return The state object containing properties and methods to manage the application's state.
 */
export function createState(inParentComponent) {
  return {

    // Visibility flag for the "Please Wait" dialog, used during server interactions.
    pleaseWaitVisible: false,

    // Array to store the list of contacts.
    contacts: [],

    // Array to store the list of mailboxes.
    mailboxes: [],

    // Array to store messages in the currently selected mailbox.
    messages: [],

    // Current view displayed in the UI (like "welcome", "message", "compose", etc.).
    currentView: "welcome",

    // Currently selected mailbox, if any.
    currentMailbox: null,

    // Details of the message currently being viewed or composed.
    messageID: null, // ID of the message, populated when viewing an existing message.
    messageDate: null,
    messageFrom: null,
    messageTo: null,
    messageSubject: null,
    messageBody: null,

    // Details of the contact currently being viewed or added.
    contactID: null,
    contactName: null,
    contactEmail: null,

    // ------------------------------------------------------------------------------------------------
    // View Switch functions
    // ------------------------------------------------------------------------------------------------

    /**
     * Toggles the visibility of the "Please Wait" dialog.
     * Used to block UI interaction during server calls.
     * 
     * @param inVisible Set to true to show the dialog, false to hide.
     */
    showHidePleaseWait: function (inVisible: boolean): void {
      this.setState({ pleaseWaitVisible: inVisible });
    }.bind(inParentComponent),

    /**
     * Displays the ContactView in view mode for a specified contact.
     * 
     * @param inID The ID of the contact to display.
     * @param inName The name of the contact to display.
     * @param inEmail The email of the contact to display.
     */
    showContact: function (inID: string, inName: string, inEmail: string): void {
      this.setState({ currentView: "contact", contactID: inID, contactName: inName, contactEmail: inEmail });
    }.bind(inParentComponent),

    /**
     * Switches to the ContactView in add mode to create a new contact.
     */
    showAddContact: function (): void {
      this.setState({ currentView: "contactAdd", contactID: null, contactName: "", contactEmail: "" });
    }.bind(inParentComponent),

    /**
     * Displays the MessageView in view mode for a selected message.
     * 
     * @param inMessage The message object to display.
     */
    showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const messageBody: String = await imapWorker.getMessageBody(inMessage.id, this.state.currentMailbox);
      this.state.showHidePleaseWait(false);

      this.setState({
        currentView: "message",
        messageID: inMessage.id, messageDate: inMessage.date, messageFrom: inMessage.from,
        messageTo: "", messageSubject: inMessage.subject, messageBody: messageBody
      });
    }.bind(inParentComponent), /* End showMessage(). */

    /**
     * Switches to the MessageView in compose mode.
     * Different behaviors for new message, reply, or message to a contact.
     * 
     * @param inType Type of message composition ("new", "reply", or "contact").
     */
    showComposeMessage: function (inType: string): void {
      switch (inType) {
        case "new":
          this.setState({ currentView: "compose", messageTo: "", messageSubject: "", messageBody: "", messageFrom: config.userEmail });
          break;
        case "reply":
          this.setState({
            currentView: "compose",
            messageTo: this.state.messageFrom, messageSubject: `Re: ${this.state.messageSubject}`,
            messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`, messageFrom: config.userEmail
          });
          break;
        case "contact":
          this.setState({
            currentView: "compose",
            messageTo: this.state.contactEmail, messageSubject: "", messageBody: "",
            messageFrom: config.userEmail
          });
          break;
      }
    }.bind(inParentComponent),

    // ------------------------------------------------------------------------------------------------
    // List functions
    // ------------------------------------------------------------------------------------------------

    /**
     * Adds a mailbox to the mailboxes list in the state.
     * 
     * @param inMailbox The mailbox object to add.
     */
    addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
      const mailboxesCopy: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
      mailboxesCopy.push(inMailbox);
      this.setState({ mailboxes: mailboxesCopy });
    }.bind(inParentComponent),

    /**
     * Adds a contact to the contacts list in the state.
     * 
     * @param inContact The contact object to add.
     */
    addContactToList: function (inContact: Contacts.IContact): void {
      const contactsCopy = this.state.contacts.slice(0);
      contactsCopy.push({ _id: inContact._id, name: inContact.name, email: inContact.email });
      this.setState({ contacts: contactsCopy });
    }.bind(inParentComponent),

    /**
     * Adds a message to the messages list in the current mailbox.
     * 
     * @param inMessage The message object to add.
     */
    addMessageToList: function (inMessage: IMAP.IMessage): void {
      const messagesCopy = this.state.messages.slice(0);
      messagesCopy.push({ id: inMessage.id, date: inMessage.date, from: inMessage.from, subject: inMessage.subject });
      this.setState({ messages: messagesCopy });
    }.bind(inParentComponent),

    /**
     * Clears the list of messages currently being displayed.
     */
    clearMessages: function (): void {
      this.setState({ messages: [] });
    }.bind(inParentComponent), /* End clearMessages(). */

    // ------------------------------------------------------------------------------------------------
    // Event Handler functions
    // ------------------------------------------------------------------------------------------------

    /**
     * Sets the currently selected mailbox and retrieves its messages.
     * 
     * @param inPath The path of the mailbox to set as current.
     */
    setCurrentMailbox: function (inPath: String): void {
      this.setState({ currentView: "welcome", currentMailbox: inPath });
      this.state.getMessages(inPath);
    }.bind(inParentComponent),

    /**
     * Fetches messages for a specified mailbox path and updates the state.
     * 
     * @param inPath The path of the mailbox to fetch messages for.
     */
    getMessages: async function (inPath: string): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
      this.state.showHidePleaseWait(false);

      this.state.clearMessages();
      messages.forEach((inMessage: IMAP.IMessage) => {
        this.state.addMessageToList(inMessage);
      });
    }.bind(inParentComponent),

    /**
     * Handles input changes in any editable fields and updates the state.
     * 
     * @param inEvent The event object generated by the input change.
     */
    fieldChangeHandler: function (inEvent: any): void {
      if (inEvent.target.id === "contactName" && inEvent.target.value.length > 16) { return; }
      this.setState({ [inEvent.target.id]: inEvent.target.value });
    }.bind(inParentComponent),

    /**
     * Saves a new or edited contact to the server and updates the state.
     */
    saveContact: async function (): Promise<void> {
      const contactsCopy = this.state.contacts.slice(0);
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact = await contactsWorker.addContact({ name: this.state.contactName, email: this.state.contactEmail });
      this.state.showHidePleaseWait(false);
      contactsCopy.push(contact);
      this.setState({ contacts: contactsCopy, contactID: null, contactName: "", contactEmail: "" });
    }.bind(inParentComponent),

    /**
     * Deletes the currently selected contact from the server and updates the state.
     */
    deleteContact: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(this.state.contactID);
      this.state.showHidePleaseWait(false);
      const contactsCopy = this.state.contacts.filter((inElement) => inElement._id != this.state.contactID);
      this.setState({ contacts: contactsCopy, contactID: null, contactName: "", contactEmail: "" });
    }.bind(inParentComponent), /* End deleteContact(). */

    /**
     * Updates the currently selected contact in the server and updates the state.
     */
    updateContact: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact = await contactsWorker.updateContact({ _id: this.state.contactID, name: this.state.contactName, email: this.state.contactEmail });
      this.state.showHidePleaseWait(false);
      const contactsCopy = this.state.contacts.slice(0).filter((inElement) => inElement._id != this.state.contactID);
      contactsCopy.push(contact);
      this.setState({ contacts: contactsCopy, contactID: contact._id, contactName: contact.name, contactEmail: contact.email });
    }.bind(inParentComponent),

    /**
     * Deletes the currently viewed message from the server and updates the state.
     */
    deleteMessage: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      await imapWorker.deleteMessage(this.state.messageID, this.state.currentMailbox);
      this.state.showHidePleaseWait(false);
      const messagesCopy = this.state.messages.filter((inElement) => inElement.id != this.state.messageID);
      this.setState({ messages: messagesCopy, currentView: "welcome" });
    }.bind(inParentComponent),

    /**
     * Sends the composed message to the server and updates the state.
     */
    sendMessage: async function (): Promise<void> {
      this.state.showHidePleaseWait(true);
      const smtpWorker: SMTP.Worker = new SMTP.Worker();
      await smtpWorker.sendMessage(this.state.messageTo, this.state.messageFrom, this.state.messageSubject, this.state.messageBody);
      this.state.showHidePleaseWait(false);
      this.setState({ currentView: "welcome" });
    }.bind(inParentComponent)
  };
}