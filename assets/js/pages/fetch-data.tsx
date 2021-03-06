import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Main from '../components/Main';
import Languages from '../components/Languages';
import Messages from '../components/Messages';
import MessagesContainer from '../components/MessagesContainer';
import SampleMessageDisplay from '../components/SampleMessageDisplay';

const FetchData: React.FC<RouteComponentProps> = () => (
  <Main>
    <h1>Fetch Data</h1>
    <p>
      This component demonstrates fetching data from the Phoenix API endpoint.
    </p>
    <div>List Here</div>
    <MessagesContainer>
      <Messages />
    </MessagesContainer>
    <Languages />
    <br />
    <br />
    <p>
      <Link to="/">Back to home</Link>
    </p>
  </Main>
);

export default FetchData;
