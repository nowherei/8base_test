import React from 'react';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';
import { Form as FormLogic, Field } from '@8base/forms';
import {
  AsyncContent,
  Dialog,
  Grid,
  Button,
  InputField,
  DateInputField,
  ModalContext,
} from '@8base/boost';
import { Loader } from '@8base/boost';
import { removeTypename } from '../../helpers';

const CLIENT_QUERY = gql`
  query ClientsEntity($id: ID!) {
  client(id: $id) {
    id
    firstName
    lastName
    email
    phone
    birthday
  }
} 
`;

const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

const ehnhancer = graphql(CLIENT_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsTableContent', 'ClientsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Client successfully updated',
    },
  },
});

const ClientEditDialog = ehnhancer(
  class ClientEditDialog extends React.PureComponent {
    static contextType = ModalContext;

    updateOnSubmit = id => async data => {
      await this.props.clientUpdate({ variables: { data: { ...removeTypename(data), id } } });

      this.context.closeModal('CLIENT_EDIT_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('CLIENT_EDIT_DIALOG_ID');
    };

    renderForm = ({ args }) => {
      return (
        <Query query={CLIENT_QUERY} variables={{ id: args.id }}>
          {({ data, loading }) => {
            if (loading) return <Loader stretch />;
            return (
            <FormLogic
              type="UPDATE"
              tableSchemaName="Clients"
              onSubmit={this.updateOnSubmit(args.id)}
              initialValues={data.client}
              formatRelationToIds
            >
              {({ handleSubmit, invalid, submitting, pristine }) => (
                <form onSubmit={handleSubmit}>
                  <Dialog.Header title="Edit Client" onClose={this.onClose} />
                  <Dialog.Body scrollable>
                    <AsyncContent loading={loading} stretch>
                      <Grid.Layout gap="md" stretch>
                        <Grid.Box>
                          <Field name="firstName" label="First Name" component={InputField} />
                        </Grid.Box>
                        <Grid.Box>
                          <Field name="lastName" label="Last Name" component={InputField} />
                        </Grid.Box>
                        <Grid.Box>
                          <Field name="email" label="Email" component={InputField} />
                        </Grid.Box>
                        <Grid.Box>
                          <Field name="phone" label="Phone" component={InputField} />
                        </Grid.Box>
                        <Grid.Box>
                          <Field name="birthday" label="Birthday" withTime={false} component={DateInputField} />
                        </Grid.Box>
                      </Grid.Layout>
                    </AsyncContent>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button
                      color="neutral"
                      type="button"
                      variant="outlined"
                      disabled={submitting}
                      onClick={this.onClose}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" disabled={pristine || invalid} loading={submitting}>
                      Update Client
                    </Button>
                  </Dialog.Footer>
                </form>
              )}
            </FormLogic>
          )}}
        </Query>
      );
    };

    render() {
      return (
        <Dialog id={'CLIENT_EDIT_DIALOG_ID'} size="sm">
          {this.renderForm}
        </Dialog>
      );
    }
  }
);

export { ClientEditDialog };
