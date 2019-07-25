import * as React from 'react';
import { MessageContext } from './MessagesContainer';

interface Message {
  id: number;
  name: string;
  message: string;
  inserted_at: string;
  updated_at: string;
  showForm: boolean;
}

interface MessagesDisplayProps {
  messages: Message[];
}

export default class Messages extends React.Component<{}, {}> {
  static contextType = MessageContext;

  public render(): JSX.Element {
    const {
      messages,
      wsNewMessage,
      wsUpdate,
      wsDelete,
      toggleShowForm
    } = this.context;

    return (
      <>
        <MessagesDisplay
          wsUpdate={wsUpdate}
          wsDelete={wsDelete}
          messages={messages}
          toggleShowForm={toggleShowForm}
        />
        <ChatInput wsNewMessage={wsNewMessage} />
      </>
    );
  }
}

export class MessagesDisplay extends React.Component<MessagesDisplayProps, {}> {
  handleToggleForm = (id: number) => {
    this.props.toggleShowForm(id);
  };

  handleUpdateSubmit = (id: number, data: object) => {
    console.log(id, data);
    this.props.wsUpdate(id, data);
  };

  handleDelete = (id: number) => {
    console.log('id', id);
    this.props.wsDelete(id);
  };

  renderMessages = () => {
    return this.props.messages.map(
      ({ id, name, message, inserted_at, updated_at, showForm }) => {
        return showForm ? (
          <tr key={id}>
            <td>
              <UpdateForm
                messageId={id}
                startVal={name}
                handleUpdateSubmit={this.handleUpdateSubmit}
              />
            </td>
            <td>
              <div onClick={this.handleToggleForm.bind(null, id)}>
                Cancel Edit
              </div>
            </td>
            <td>
              <div onClick={this.handleDelete.bind(null, id)}>Delete</div>
            </td>
          </tr>
        ) : (
          <tr key={id}>
            <td>{name}</td>
            <td>{message}</td>
            <td>
              <div onClick={this.handleToggleForm.bind(null, id)}>Edit</div>
            </td>
            <td>
              <div onClick={this.handleDelete.bind(null, id)}>Delete</div>
            </td>
          </tr>
        );
      }
    );
  };
  render() {
    return (
      <div id="messages">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>{this.renderMessages()}</tbody>
        </table>
      </div>
    );
  }
}

export class UpdateForm extends React.Component<
  { startVal: string; messageId: number; handleUpdateSubmit: any },
  {}
> {
  state = {
    name: this.props.startVal
  };

  handleChange = (event: any) => {
    this.setState({ name: event.target.value });
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.handleUpdateSubmit(this.props.messageId, this.state);
    this.setState({ name: '' });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export class ChatInput extends React.Component<{ wsNewMessage: any }, {}> {
  state = {
    value: ''
  };

  handleChange = (event: any) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.wsNewMessage(this.state.value);
    this.setState({ value: '' });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
