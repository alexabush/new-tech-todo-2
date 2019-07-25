import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Main from '../components/Main';
import MessagesContainer from '../components/MessagesContainer';
import SampleMessageDisplay from '../components/SampleMessageDisplay';

const DisplayMessagePage: React.FC<RouteComponentProps> = () => (
  <Main>
    <h1>Display Message Page</h1>
    <div>List Here</div>
    <MessagesContainer>
      <SampleMessageDisplay />
    </MessagesContainer>
    <br />
    <br />
    <p>
      <Link to="/">Back to home</Link>
    </p>
  </Main>
);

export default DisplayMessagePage;
