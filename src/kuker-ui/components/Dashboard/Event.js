/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';

export default function Event({ event }) {
  const {
    kuker,
    ...rest
  } = event;

  return <div style={{ padding: '0 0.4em' }}><Tree data={ rest.event } /></div>;
};


Event.propTypes = {
  event: PropTypes.object
};
