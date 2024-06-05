import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText";

// ContactList Component: Displays a list of contacts.
const ContactList = ({ state }) => (
  <List>
    {/* Mapping each contact in the state to a list item */}
    {state.contacts.map(value => {
      return (
        // ListItem for each contact. Clicking on a ListItem shows the contact's details.
        <ListItem key={value._id} button onClick={() => state.showContact(value._id, value.name, value.email)}>
          {/* Avatar with a Person icon representing a contact */}
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          {/* Displaying the contact's name and email */}
          <ListItemText primary={`${value.name}`} secondary={`${value.email}`} />
        </ListItem>
      );
    })}
  </List>
);

export default ContactList;
