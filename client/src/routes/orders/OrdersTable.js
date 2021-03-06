import React from 'react';
import gql from 'graphql-tag';
import objectPath from 'object-path';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { DateTime } from 'luxon';
import { TableBuilder, Dropdown, Icon, Menu, Tag, Row, withModal } from '@8base/boost';
import { FIELD_TYPE, DATE_FORMATS, SWITCH_FORMATS, SWITCH_VALUES } from '@8base/utils';
import { withRouter } from 'react-router-dom';
import { getTotalOrder } from '../../helpers';

const ORDERS_LIST_QUERY = gql`
  query OrdersTableContent(
    $filter: OrderFilter
    $orderBy: [OrderOrderBy]
    $after: String
    $before: String
    $first: Int
    $last: Int
    $skip: Int
  ) {
    ordersList(
      filter: $filter
      orderBy: $orderBy
      after: $after
      before: $before
      first: $first
      last: $last
      skip: $skip
    ) {
      items {
        id
        client {
          id
          _description
        }
        address
        deliveryDt
        comment
        status
        _description
        orderItems {
          count
          items {
            id
            product {
              price
            }
            quantity
          }
        }
      }
      count
    }
  }
`;

const TABLE_COLUMNS = [
  {
    name: 'client',
    title: 'Client',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.RELATION,
      fieldTypeAttributes: {
        format: '',
      },
    },
  },
  {
    name: 'address',
    title: 'Address',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'deliveryDt',
    title: 'DeliveryDt',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.DATE,
      fieldTypeAttributes: {
        format: 'DATETIME',
      },
    },
  },
  {
    name: 'comment',
    title: 'Comment',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.TEXT,
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
      },
    },
  },
  {
    name: 'status',
    title: 'Status',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.SWITCH,
      fieldTypeAttributes: {
        format: 'CUSTOM',
      },
    },
  },
  {
    name: 'orderItems',
    title: 'Total',
    meta: {
      isList: false,
      fieldType: FIELD_TYPE.NUMBER,
      fieldTypeAttributes: {
        format: '',
      },
    },
  },
  {
    name: 'edit',
    title: '',
    width: '60px',
  },
];

const enhancer = compose(withModal, graphql(ORDERS_LIST_QUERY, { name: 'orders' }));

const OrdersTable = enhancer(
  withRouter(
    class OrdersTable extends React.PureComponent {
      renderEdit = rowData => {
        const { history, match } = this.props;
        return (
          <Dropdown defaultOpen={false}>
            <Dropdown.Head>
              <Icon name="More" size="sm" color="LIGHT_GRAY2" />
            </Dropdown.Head>
            <Dropdown.Body pin="right">
              {({ closeDropdown }) => (
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      history.push(`${!/\/$/.test(match.url) ? match.url + '/' : ''}${rowData.id}`);
                    }}
                  >
                    Open
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      this.props.openModal('ORDER_EDIT_DIALOG_ID', { id: rowData.id });
                      closeDropdown();
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      this.props.openModal('ORDER_DELETE_DIALOG_ID', { id: rowData.id });
                      closeDropdown();
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              )}
            </Dropdown.Body>
          </Dropdown>
        );
      };

      renderItems = (column, rowData, handler) => {
        const dataPath = column.name.split('.');
        const cellData = objectPath.get(rowData, dataPath) || '';

        if (column.meta.isList) {
          const itemsArray = cellData.items ? cellData.items : cellData;

          return (
            <Row style={{ flexWrap: 'wrap' }}>
              {itemsArray && itemsArray.map(item => !!item && <Tag color="LIGHT_GRAY2">{handler(item)}</Tag>)}
            </Row>
          );
        } else {
          return cellData && <div>{handler(cellData)}</div>;
        }
      };

      renderScalar = (column, rowData) => {
        return this.renderItems(column, rowData, item => item);
      };

      renderDate = (column, rowData) => {
        const dateFormat =
          column.meta.fieldTypeAttributes.format === DATE_FORMATS.DATE ? DateTime.DATE_SHORT : DateTime.DATETIME_SHORT;

        return this.renderItems(column, rowData, item => DateTime.fromISO(item).toLocaleString(dateFormat));
      };

      renderSwitch = (column, rowData) => {
        if (column.meta.fieldTypeAttributes.format === SWITCH_FORMATS.CUSTOM) {
          return this.renderItems(column, rowData, item => item);
        } else {
          return this.renderItems(column, rowData, item => SWITCH_VALUES[column.meta.fieldTypeAttributes.format][item]);
        }
      };

      renderRelation = (column, rowData) => {
        const dataPath = column.name.split('.');

        if (column.meta.isList) {
          return objectPath.get(rowData, [...dataPath, 'count']) || '';
        } else {
          return objectPath.get(rowData, [...dataPath, '_description']) || '';
        }
      };

      renderTotal = (column, rowData) => {
        return this.renderItems(column, rowData, orderItems => getTotalOrder(orderItems.items));
      };

      renderCell = (column, rowData) => {
        if (column.name === 'edit') {
          return this.renderEdit(rowData);
        }

        if (column.name === 'orderItems') {
          return this.renderTotal(column, rowData);
        }

        switch (column.meta.fieldType) {
          case FIELD_TYPE.TEXT:
          case FIELD_TYPE.NUMBER:
            return this.renderScalar(column, rowData);

          case FIELD_TYPE.DATE:
            return this.renderDate(column, rowData);

          case FIELD_TYPE.SWITCH:
            return this.renderSwitch(column, rowData);

          case FIELD_TYPE.RELATION:
            return this.renderRelation(column, rowData);

          default:
            return null;
        }
      };

      openCreateModal = () => {
        const { openModal } = this.props;

        openModal('ORDER_CREATE_DIALOG_ID');
      };

      render() {
        const { orders } = this.props;
        const tableData = objectPath.get(orders, ['ordersList', 'items']) || [];
        return (
          <TableBuilder
            loading={orders.loading}
            data={tableData}
            columns={TABLE_COLUMNS}
            action="Create Order"
            renderCell={this.renderCell}
            onActionClick={this.openCreateModal}
          />
        );
      }
    }
  )
);

export { OrdersTable };
