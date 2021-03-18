import React from 'react';
import { Card, Heading, Loader, Text, Column } from '@8base/boost';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { DateTime } from 'luxon';
import OrderInfo from '../orders/OrderInfo'

const CLIENT_DETAILS_QUERY = gql`
  query ClientDetailContent($id: ID!) {
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

  const { loading, data } = useQuery(CLIENT_DETAILS_QUERY, {
    variables: { id },
  });
  if (loading) return <Loader stretch />;

  const {firstName, birthday, email, lastName, phone, orders} = data.client;

  const ordersList = orders.items.map((item, key) => {
    const {id} = item;
    return <OrderInfo key={id} item={item} title={`Order #${key + 1}`} />
  });

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
          <Heading type="h3" text="Order List" />
          {ordersList.length ? ordersList : <Text>No orders</Text>}
        </Column>
      </Card.Body>
    </Card>
  );
};

export default withRouter(ClientDetails);
