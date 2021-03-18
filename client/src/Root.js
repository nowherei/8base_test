import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { ProtectedRoute } from './shared/components';
import { MainPlate, ContentPlate, Nav } from './components';
import { Auth } from './routes/auth';
/** __APP_PAGES_IMPORTS__ */
import { Products } from './routes/products';
import { Clients } from './routes/clients';
import ClientDetails from './routes/clients/ClientDetails';
import OrderDetails from './routes/orders/OrderDetails';
import { Orders } from './routes/orders';

export const Root = () => (
  <Switch>
    <Route path="/auth" component={Auth} />
    <ProtectedRoute>
      <MainPlate>
        <Nav.Plate color="BLUE">
          {/** __APP_ROUTE_LINKS__ */}
          <Nav.Item icon="Group" to="/clients" label="Clients" />
          <Nav.Item icon="Contract" to="/orders" label="Orders" />
          <Nav.Item icon="Planet" to="/products" label="Products" />
        </Nav.Plate>
        <ContentPlate>
          <Switch>
            {/** __APP_ROUTES__ */}
            <ProtectedRoute exact path="/clients" component={Clients} />
            <ProtectedRoute exact path="/clients/:id" component={ClientDetails} />
            <ProtectedRoute exact path="/orders" component={Orders} />
            <ProtectedRoute exact path="/orders/:id" component={OrderDetails} />
            <ProtectedRoute exact path="/products" component={Products} />
            <Redirect to="/clients" />
          </Switch>
        </ContentPlate>
      </MainPlate>
    </ProtectedRoute>
  </Switch>
);
