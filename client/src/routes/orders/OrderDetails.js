import React from 'react';
import { Card, Heading, Loader, Text, Column } from '@8base/boost';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { DateTime } from 'luxon';
import OrderInfo from '../orders/OrderInfo'

const ORDER_DETAILS_QUERY = gql`
  query OrderDetailsContent($id: ID!) {
    order(id: $id) {
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
      client {
        id
        firstName
        lastName
        email
        phone
        birthday
      }
    }
  }
`;

const OrderDetails = ({ match }) => {
  const { id } = match.params;

  const { loading, error, data } = useQuery(ORDER_DETAILS_QUERY, {
    variables: { id },
  });
  if (loading) return <Loader stretch />;

  const {client} = data.order;
  const {firstName, birthday, email, lastName, phone, orders} = client;

  return (
    <Card padding="md" stretch>
      <Card.Header>
        <Heading type="h2" text={`Details Order from  ${firstName}`} />
      </Card.Header>

      <Card.Body stretch scrollable>
        <Column>
          <Text>First name: { firstName }</Text>
          <Text>Last name: { lastName }</Text>
          <Text>Bithday: { DateTime.fromISO(birthday).toLocaleString() }</Text>
          <Text>Email: { email }</Text>
          <Text>Phone: { phone }</Text>
          <OrderInfo key={id} item={data.order} />
        </Column>
      </Card.Body>
    </Card>
  );
};

export default withRouter(OrderDetails);
