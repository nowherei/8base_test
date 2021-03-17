import React from 'react';
import { Heading, Text } from '@8base/boost';
import ClientDetailsOrderItem from './ClientDetailsOrderItem'

const ClientDetailsOrderList = ({orders}) => {
  
  const items = orders.items.map((item, key) => {
    const {id} = item;
    return <ClientDetailsOrderItem key={id} item={item} number={key + 1} />
  });

  return (
    <React.Fragment>
      <Heading type="h3" text="Order List" />
      {items.length ? items : <Text>No orders</Text>}
    </React.Fragment>
  )
}

export default ClientDetailsOrderList;