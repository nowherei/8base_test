import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import { AppProvider } from '@8base-react/app-provider';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import { BoostProvider, AsyncContent } from '@8base/boost';
import { ToastContainer, toast } from 'react-toastify';

import { HIDE_TOAST_ERROR_MESSAGE, TOAST_SUCCESS_MESSAGE } from 'shared/constants';

import { Root } from 'Root';


const { REACT_APP_8BASE_API_ENDPOINT, REACT_APP_CLIENT_DOMAIN, REACT_APP_CLIENT_ID } = process.env;

const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES.WEB_COGNITO,
    subscribable: true,
  },
  {
    clientId: REACT_APP_CLIENT_ID,
    domain: REACT_APP_CLIENT_DOMAIN,
    redirectUri: `${window.location.origin}/auth/callback`,
    logoutRedirectUri: `${window.location.origin}/auth`,
  }
);

const Routes = () => {
  return <Root />;
};

class Application extends React.PureComponent {
  onRequestSuccess = ({ operation }) => {
    const message = operation.getContext()[TOAST_SUCCESS_MESSAGE];

    if (message) {
      toast.success(message);
    }
  };

  onRequestError = ({ graphQLErrors, operation }) => {
    const hasGraphQLErrors = Array.isArray(graphQLErrors) && graphQLErrors.length > 0;
    const hideToastErrorMessage = operation.getContext()[HIDE_TOAST_ERROR_MESSAGE];

    if (hasGraphQLErrors && !hideToastErrorMessage) {
      graphQLErrors.forEach(error => {
        toast.error(error.message);
      });
    }
  };

  render() {
    return (
      <BrowserRouter>
        <BoostProvider>
          <AppProvider
            uri={REACT_APP_8BASE_API_ENDPOINT}
            authClient={authClient}
            onRequestSuccess={this.onRequestSuccess}
            onRequestError={this.onRequestError}
          >
            {({ loading }) => (
              <AsyncContent loading={loading} stretch>
                <Routes />
              </AsyncContent>
            )}
          </AppProvider>
          <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        </BoostProvider>
      </BrowserRouter>
    );
  }
}

export { Application };
