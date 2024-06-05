import React, { Component } from "react";

// Material-UI components for dialogues and layouts
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Importing child components for the base layout
import Toolbar from "./Toolbar";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import ContactList from "./ContactList";
import WelcomeView from "./WelcomeView";
import ContactView from "./ContactView";
import MessageView from "./MessageView";
import { createState } from "../state";

class BaseLayout extends Component {
  // Initializing state using the createState function
  state = createState(this);

  render() {
    return (
      <div className="appContainer">
        {/* Dialog for loading/waiting indication */}
        <Dialog open={ this.state.pleaseWaitVisible } disableBackdropClick={ true } disableEscapeKeyDown={ true }
          transitionDuration={ 0 }>
          <DialogTitle style={{ textAlign:"center" }}>Please Wait</DialogTitle>
          <DialogContent><DialogContentText>...Contacting server...</DialogContentText></DialogContent>
        </Dialog>

        {/* Toolbar component with app functionalities */}
        <div className="toolbar"><Toolbar state={ this.state } /></div>

        {/* List of mailboxes */}
        <div className="mailboxList"><MailboxList state={ this.state } /></div>

        {/* Main content area */}
        <div className="centerArea">
          {/* List of messages */}
          <div className="messageList"><MessageList state={ this.state } /></div>

          {/* Conditional rendering for center views based on the current state */}
          <div className="centerViews">
            { this.state.currentView === "welcome" && <WelcomeView /> }
            { (this.state.currentView === "message" || this.state.currentView === "compose") &&
              <MessageView state={ this.state } />
            }
            { (this.state.currentView === "contact" || this.state.currentView === "contactAdd") &&
              <ContactView state={ this.state } />
            }
          </div>
        </div>

        {/* List of contacts */}
        <div className="contactList"><ContactList state={ this.state } /></div>

      </div>
    );
  }
}

export default BaseLayout;

