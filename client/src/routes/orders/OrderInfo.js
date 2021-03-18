import React from 'react';
import { Heading, Table, Text } from '@8base/boost';
import { DateTime } from 'luxon';

const OrderInfo = ({ item, title }) => {
  const { address, comment, deliveryDt, status, orderItems } = item;

  const total = orderItems.items.reduce((acc, current) => {
    const {product:{price}, quantity } = current;
    const cost = Math.round(+price * quantity * 100) / 100;
    return Math.round((acc + cost) * 100) / 100;
  }, 0);

  const tableProducts = (
    <div style={{ display: 'flex', width: '100%' }}>
      <Table>
        <Table.Header columns="repeat(5, 1fr)">
          <Table.HeaderCell>Picture</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Cost</Table.HeaderCell>
        </Table.Header>
        <Table.Body data={orderItems.items}>
          {item => {
            const { id, product, quantity } = item;
            const cost = Math.round(+product.price * quantity * 100) / 100;
            return (
              <Table.BodyRow columns="repeat(5, 1fr)" key={id}>
                <Table.BodyCell>
                  {product.picture.downloadUrl && (
                    <img src={product.picture.downloadUrl} alt="" style={{ width: '5rem', height: '5rem' }} />
                  )}
                </Table.BodyCell>
                <Table.BodyCell>{product.name}</Table.BodyCell>
                <Table.BodyCell>{product.price}</Table.BodyCell>
                <Table.BodyCell>{quantity}</Table.BodyCell>
                <Table.BodyCell>{cost}</Table.BodyCell>
              </Table.BodyRow>
            );
          }}
        </Table.Body>
      </Table>
    </div>
  );
  return (
    <React.Fragment>
      {title ? <Heading type="h4" text={title} /> : ''}
      <Text>DeliveryDt: {DateTime.fromISO(deliveryDt).toLocaleString(DateTime.DATETIME_SHORT)}</Text>
      <Text>Address: {address}</Text>
      <Text>Comment: {comment}</Text>
      <Text>Status: {status}</Text>
      {tableProducts}
      {total ? <Text style={{margin: '0 0 25px'}} weight="bold">Total: {total}</Text> : ''}
    </React.Fragment>
  );
};

export default OrderInfo;
