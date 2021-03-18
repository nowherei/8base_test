import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Form as FormLogic, Field } from '@8base/forms';
import {
  Dialog,
  Grid,
  Button,
  InputField,
  ModalContext,
} from '@8base/boost';
import { FileInputField } from '../../shared/components';

const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

const enhancer = graphql(PRODUCT_CREATE_MUTATION, {
  name: 'productCreate',
  options: {
    refetchQueries: ['ProductsTableContent', 'ProductsList'],
    context: {
      TOAST_SUCCESS_MESSAGE: 'Product successfully created',
    },
  },
});

const ProductCreateDialog = enhancer(
  class ProductCreateDialog extends React.PureComponent {
    static contextType = ModalContext;

    onSubmit = async data => {
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

      await this.props.productCreate({ variables: { data } });

      this.context.closeModal('PRODUCT_CREATE_DIALOG_ID');
    };

    onClose = () => {
      this.context.closeModal('PRODUCT_CREATE_DIALOG_ID');
    };

    renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
      <form onSubmit={handleSubmit}>
        <Dialog.Header title="New Product" onClose={this.onClose} />
        <Dialog.Body scrollable>
          <Grid.Layout gap="md" stretch>
            <Grid.Box>
              <Field name="picture" label="Picture" component={FileInputField} maxFiles={1} public={true} />
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
        </Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" type="button" variant="outlined" disabled={submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" loading={submitting}>
            Create Product
          </Button>
        </Dialog.Footer>
      </form>
    );

    render() {
      return (
        <Dialog id={'PRODUCT_CREATE_DIALOG_ID'} size="sm">
          <FormLogic type="CREATE" tableSchemaName="Products" onSubmit={this.onSubmit} formatRelationToIds>
            {this.renderFormContent}
          </FormLogic>
        </Dialog>
      );
    }
  }
);

export { ProductCreateDialog };
