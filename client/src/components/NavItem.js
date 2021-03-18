import React from 'react';
import { Navigation } from '@8base/boost';
import { NavLink } from 'react-router-dom';

const NavItem = props => {
  const {parentExpanded, ...rest} = props;
  return <Navigation.Item tagName={NavLink} {...rest} />;
}

export { NavItem };
