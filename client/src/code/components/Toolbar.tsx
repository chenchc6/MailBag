import React from "react";
import Button from "@material-ui/core/Button";
import NewContactIcon from "@material-ui/icons/ContactMail";
import NewMessageIcon from "@material-ui/icons/Email";

// Toolbar component: Provides quick action buttons for the user.
const Toolbar = ({ state }) => (
  <div>
    {/* New Message Button: Opens a form to compose a new message */}
    <Button 
      variant="contained" 
      color="primary" 
      size="small" 
      style={{ marginRight:10 }}
      onClick={ () => state.showComposeMessage("new") } 
    >
      <NewMessageIcon style={{ marginRight:10 }} />New Message
    </Button>

    {/* New Contact Button: Opens a form to add a new contact */}
    <Button 
      variant="contained" 
      color="primary" 
      size="small" 
      style={{ marginRight:10 }}
      onClick={ state.showAddContact } 
    >
      <NewContactIcon style={{ marginRight:10 }} />New Contact
    </Button>
  </div>
);

export default Toolbar;

