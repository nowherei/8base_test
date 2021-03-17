import React from 'react';
import { Card, Heading, Loader, Text, Column } from '@8base/boost';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { DateTime } from 'luxon';
import ClientDetailsOrderList from './ClientDetailsOrderList';

const CLIENT_QUERY = gql`
  query ClientsEntity($id: ID!) {
    client(id: $id) {
      id
      firstName
      lastName
      email
      phone
      birthday
      orders(sort: { deliveryDt: DESC }) {
        count
        items {
          id
          address
          deliveryDt
          comment
          status
          orderItems {
            count
            items {
              id
              product {
                id
                name
                picture {
                  downloadUrl
                }
                price
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

const ClientDetails = ({ match }) => {
  const { id } = match.params;

  const { loading, error, data } = useQuery(CLIENT_QUERY, {
    variables: { id },
  });
  if (loading) return <Loader stretch />;

  const {firstName, birthday, email, lastName, phone, orders} = data.client;

  return (
    <Card padding="md" stretch>
      <Card.Header>
        <Heading type="h2" text={firstName} />
      </Card.Header>

      <Card.Body stretch scrollable>
        <Column>
          <Text>First name: { firstName }</Text>
          <Text>Last name: { lastName }</Text>
          <Text>Bithday: { DateTime.fromISO(birthday).toLocaleString() }</Text>
          <Text>Email: { email }</Text>
          <Text>Phone: { phone }</Text>
          <ClientDetailsOrderList orders={orders} />
        </Column>
      </Card.Body>
    </Card>
  );
};

export default withRouter(ClientDetails);
