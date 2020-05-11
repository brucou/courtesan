/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';
import manifest from '../../../extension-static/manifest.json';

// function reloadExtension() {
//   if (location && location.reload) {
//     location.reload();
//   }
// }

export default function NoEvents() {
  return (
    <div className='noEvents'>
      <img src='./img/courtesan.png' className='logo'/>
      <div className='balloon'>
        Hey, I&apos;m version { manifest.version } and I&apos;m not broken. Just wait a bit or check my <a href='https://brucou.github.io/documentation/v1/tooling/devtool.html' target='_blank'>official docs</a>.<br />
      </div>
    </div>
  );
};

NoEvents.propTypes = {
  healthyComponent: PropTypes.element
};
