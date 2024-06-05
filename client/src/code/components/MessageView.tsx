import React from "react";
import { InputBase, TextField, Button } from "@material-ui/core";

// MessageView Component: Displays and manages the state of messages.
const MessageView = ({ state }) => (
  <form>
    {/* Display message ID and date if the current view is 'message' */}
    {state.currentView === "message" && (
      <>
        <InputBase
          defaultValue={`ID ${state.messageID}`}
          margin="dense"
          disabled={true}
          fullWidth={true}
          className="messageInfoField"
        />
        <br />
        <InputBase
          defaultValue={state.messageDate}
          margin="dense"
          disabled={true}
          fullWidth={true}
          className="messageInfoField"
        />
        <br />
      </>
    )}

    {/* Display 'From' field for messages */}
    {state.currentView === "message" && (
      <>
        <TextField
          margin="dense"
          variant="outlined"
          fullWidth={true}
          label="From"
          value={state.messageFrom}
          disabled={true}
          InputProps={{ style: { color: "#000000" } }}
        />
        <br />
      </>
    )}

    {/* Allow setting 'To' field when composing a message */}
    {state.currentView === "compose" && (
      <>
        <TextField
          margin="dense"
          id="messageTo"
          variant="outlined"
          fullWidth={true}
          label="To"
          value={state.messageTo}
          InputProps={{ style: { color: "#000000" } }}
          onChange={state.fieldChangeHandler}
        />
        <br />
      </>
    )}

    {/* Common 'Subject' field for viewing and composing */}
    <TextField
      margin="dense"
      id="messageSubject"
      label="Subject"
      variant="outlined"
      fullWidth={true}
      value={state.messageSubject}
      disabled={state.currentView === "message"}
      InputProps={{ style: { color: "#000000" } }}
      onChange={state.fieldChangeHandler}
    />
    <br />

    {/* Common 'Message Body' field for viewing and composing */}
    <TextField
      margin="dense"
      id="messageBody"
      variant="outlined"
      fullWidth={true}
      multiline={true}
      rows={12}
      value={state.messageBody}
      disabled={state.currentView === "message"}
      InputProps={{ style: { color: "#000000" } }}
      onChange={state.fieldChangeHandler}
    />

    {/* Conditional rendering of buttons based on the current view */}
    {state.currentView === "compose" && (
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ marginTop: 10 }}
        onClick={state.sendMessage}
      >
        Send
      </Button>
    )}
    {state.currentView === "message" && (
      <>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10, marginRight: 10 }}
          onClick={() => state.showComposeMessage("reply")}
        >
          Reply
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10 }}
          onClick={state.deleteMessage}
        >
          Delete
        </Button>
      </>
    )}
  </form>
);

export default MessageView;