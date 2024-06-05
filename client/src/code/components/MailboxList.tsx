import React from "react";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";

// MailboxList Component: Displays a list of mailboxes.
const MailboxList = ({ state }) => (
  <List>
    {/* Iterating over the list of mailboxes from the state */}
    {state.mailboxes.map(value => {
      return (
        // Chip component representing each mailbox
        <Chip
          key={value.path} // Unique key for each mailbox chip
          label={`${value.name}`} // Displaying the mailbox name
          onClick={() => state.setCurrentMailbox(value.path)} // Setting current mailbox on click
          style={{ width: 128, marginBottom: 10 }} // Styling for the chip
          color={state.currentMailbox === value.path ? "secondary" : "primary"} // Color changes based on the current mailbox
        />
      );
    })}
  </List>
);

export default MailboxList;