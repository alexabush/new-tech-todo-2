import * as React from 'react';
import { MessageContext, MessageConsumer } from './MessagesContainer';

export default class SampleMessageDisplay extends React.Component<{}, {}> {
  static contextType = MessageContext;

  render() {
    const { messages, wsNewMessage, wsUpdate, wsDelete } = this.context;
    return (
      <div>
        {messages.map(message => {
          return <div key={message.id}>{message.name}</div>;
        })}
      </div>
    );
  }
}
