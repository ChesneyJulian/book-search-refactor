// import apolloclient, cache, provider, and httplink from apollo client
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
// import setContext from apollo/clinet/link/context
import { setContext } from '@apollo/client/link/context'
import { Outlet } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql'
});

// middleware to attach the JWT token to every request as an 'authorization' header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  // return headers to context 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
