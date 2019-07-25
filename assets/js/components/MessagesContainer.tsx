import * as React from 'react';
import socket from '../socket';

export const MessageContext = React.createContext({});

export default class MessagesProvider extends React.Component<{}, {}> {
  state = {
    channel: socket.channel('room:lobby', {}),
    messages: []
  };
  componentDidMount() {
    const { channel } = this.state;

    channel
      .join()
      .receive('ok', resp => {
        console.log('Joined successfully', resp);
      })
      .receive('error', resp => {
        console.log('Unable to join', resp);
      });
    channel.push('load');

    channel.on('load', ({ messages }: any) => {
      console.log('loading from channel');
      const data = messages.map((message: object) => JSON.parse(message));
      this.setState({ messages: data });
    });

    channel.on('new_msg', ({ message }: object) => {
      console.log(`${message}`);
      this.setState({
        messages: [...this.state.messages, JSON.parse(message)]
      });
    });

    channel.on('delete', ({ deleted_message }: any) => {
      this.setState(state => {
        const filteredMessages = state.messages.filter(message => {
          return message.id !== JSON.parse(deleted_message).id;
        });
        return { messages: filteredMessages };
      });
    });

    channel.on('update', ({ updated_message }: any) => {
      this.setState(state => {
        const updatedMessages = state.messages.map(message => {
          if (message.id === JSON.parse(updated_message).id) {
            return JSON.parse(updated_message);
          }
          return message;
        });
        return { messages: updatedMessages };
      });
    });
  }
  wsNewMessage = (message: string) => {
    this.state.channel.push('new_msg', { body: message });
  };
  wsUpdate = (id: number, data: object) => {
    this.state.channel.push('update', { id, body: data });
  };
  wsDelete = (id: number) => {
    this.state.channel.push('delete', { id });
  };
  toggleShowForm = (id: number) => {
    this.setState(state => {
      return {
        messages: state.messages.map(message => {
          if (message.id !== id) return message;
          if (message.showForm) {
            message.showForm = false;
          } else {
            message.showForm = true;
          }
          return message;
        })
      };
    });
  };

  render() {
    return (
      <MessageContext.Provider
        value={{
          messages: this.state.messages,
          wsNewMessage: this.wsNewMessage,
          wsUpdate: this.wsUpdate,
          wsDelete: this.wsDelete,
          toggleShowForm: this.toggleShowForm
        }}
      >
        {this.props.children}
      </MessageContext.Provider>
    );
  }
}

export const MessageConsumer = MessageContext.Consumer;
