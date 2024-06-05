import React from "react";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

// ContactView Component: Allows viewing and editing of contact details.
const ContactView = ({ state }) => (
  <form>
    {/* Text field for contact name */}
    <TextField
      margin="dense"
      id="contactName"
      label="Name"
      value={state.contactName}
      variant="outlined"
      InputProps={{ style: { color: "#000000" } }}
      style={{ width: 260 }}
      onChange={state.fieldChangeHandler}
    />
    <br />

    {/* Text field for contact email */}
    <TextField
      margin="dense"
      id="contactEmail"
      label="Email"
      value={state.contactEmail}
      variant="outlined"
      InputProps={{ style: { color: "#000000" } }}
      style={{ width: 520 }}
      onChange={state.fieldChangeHandler}
    />
    <br />

    {/* Conditionally render Save, Update, Delete, and Send Email buttons based on the current view */}
    {state.currentView === "contactAdd" && (
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginTop: 10 }}
        onClick={state.saveContact}>
        Save
      </Button>
    )}
    {state.currentView === "contact" && (
      <>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10, marginRight: 10 }}
          onClick={state.updateContact}>
          Update Contact
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10, marginRight: 10 }}
          onClick={state.deleteContact}>
          Delete
      </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10 }}
          onClick={() => state.showComposeMessage("contact")}>
          Send Email
        </Button>
      </>
    )}
  </form>
);

export default ContactView;