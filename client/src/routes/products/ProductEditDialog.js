import React from 'react';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';
import { Form as FormLogic, Field} from '@8base/forms';
import {
  AsyncContent,
  Dialog,
  Grid,
  Button,
  InputField,
  ModalContext,
} from '@8base/boost';
import { FileInputField } from 'shared/components';

import { Loader } from '@8base/boost';
import { removeTypename } from 'helpers';

const PRODUCT_QUERY = gql`
  query ProductsEntity($id: ID!) {
    product(id: $id) {
      id
      picture {
        id
        fileId
        filename
        downloadUrl
        shareUrl
        meta
      }
      name
      description
      price
    }
  }
`;

const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

const ehnhancer = graphql(PRODUCT_UPDATE_MUTATION, {
  name: 'productUpdate',
  options: {
    refetchQueries: ['ProductsTableContent', 'ProductsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Product successfully updated',
    },
  },
});

const ProductEditDialog = ehnhancer(
  class ProductEditDialog extends React.PureComponent {
    static contextType = ModalContext;

    updateOnSubmit = id => async data => {
      data = {
        ...data, 
        picture: {
          create: {
            fileId: data.picture.fileId,
            filename: data.picture.filename,
            public: data.picture.public,
          }
        }
      };
      await this.props.productUpdate({ variables: { data: { ...removeTypename(data), id } } });

      this.context.closeModal('PRODUCT_EDIT_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('PRODUCT_EDIT_DIALOG_ID');
    };

    renderForm = ({ args }) => {
      return (
        <Query query={PRODUCT_QUERY} variables={{ id: args.id }}>
          {({ data, loading }) => {
            if (loading) return <Loader stretch />;
            return (
              <FormLogic
                type="UPDATE"
                tableSchemaName="Products"
                onSubmit={this.updateOnSubmit(args.id)}
                initialValues={data.product}
                formatRelationToIds
              >
                {({ handleSubmit, invalid, submitting, pristine }) => (
                  <form onSubmit={handleSubmit}>
                    <Dialog.Header title="Edit Product" onClose={this.onClose} />
                    <Dialog.Body scrollable>
                      <AsyncContent loading={loading} stretch>
                        <Grid.Layout gap="md" stretch>
                          <Grid.Box>
                            <Field name="picture" label="Picture" component={FileInputField} />
                          </Grid.Box>
                          <Grid.Box>
                            <Field name="name" label="Name" component={InputField} />
                          </Grid.Box>
                          <Grid.Box>
                            <Field name="description" label="Description" component={InputField} />
                          </Grid.Box>
                          <Grid.Box>
                            <Field name="price" label="Price" type="number" component={InputField} />
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
                        Update Product
                      </Button>
                    </Dialog.Footer>
                  </form>
                )}
              </FormLogic>
            );
          }}
        </Query>
      );
    };

    render() {
      return (
        <Dialog id={'PRODUCT_EDIT_DIALOG_ID'} size="sm">
          {this.renderForm}
        </Dialog>
      );
    }
  }
);

export { ProductEditDialog };
