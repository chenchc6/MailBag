import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// MessageList Component: Displays a list of messages in a table format.
const MessageList = ({ state }) => (
  // Material-UI Table component for displaying messages
  <Table stickyHeader padding="none">
    {/* Table header defining the columns */}
    <TableHead>
      <TableRow>
        {/* Date column */}
        <TableCell style={{ width: 120 }}>Date</TableCell>
        {/* From column */}
        <TableCell style={{ width: 200 }}>From</TableCell>
        {/* Subject column */}
        <TableCell>Subject</TableCell>
      </TableRow>
    </TableHead>
    {/* Table body where messages are listed */}
    <TableBody>
      {/* Mapping each message to a table row */}
      {state.messages.map(message => (
        <TableRow key={message.id} onClick={() => state.showMessage(message)}>
          {/* Displaying the message date, formatted as a local date string */}
          <TableCell>{new Date(message.date).toLocaleDateString()}</TableCell>
          {/* Displaying the sender of the message */}
          <TableCell>{message.from}</TableCell>
          {/* Displaying the subject of the message */}
          <TableCell>{message.subject}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MessageList;

