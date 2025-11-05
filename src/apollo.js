import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://nvzyuskncfxuohsujxqx.hasura.eu-central-1.nhost.run/v1/graphql', // Reemplaza con tu URL de GraphQL de Nhost
  headers: {
    'x-hasura-admin-secret': 'L8=3OpP9MspNTof2=BBZqx-IW_ZTkaBo' // Reemplaza con tu secreto de administrador
  },
  cache: new InMemoryCache()
});

export default client;

