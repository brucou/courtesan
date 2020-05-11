// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';

import calculateRowStyles from './helpers/calculateRowStyles';

/* eslint-disable no-use-before-define */

function getGradientValues(parentStyle) {
  const fallback = { g1: 'rgba(255, 255, 255, 0)', g2: 'rgba(255, 255, 255, 1)' };

  if (!parentStyle || !parentStyle.backgroundColor) {
    return fallback;
  }
  const toRGBAlpha = parentStyle.backgroundColor.replace('rgb(', 'rgba(');

  return {
    g1: toRGBAlpha.replace(')', ', 0)'),
    g2: toRGBAlpha.replace(')', ', 1)')
  };
}

export default function Courtesan({ event: extEvent, onClick, className }) {
  const {event, state, indent, left, right, color} = extEvent;
  const {cs, es, hs} = state;
  const iconRight = right && right.icon || "";
  const iconLeft = left && left.icon || "";
  const labelLeft= left && left.label|| "";
  const labelRight= right && right.label|| cs;
  const detail = left && left.detail || "";
  const style = calculateRowStyles({color}, { color: 'rgb(230, 230, 230)' });
  const iconStyles = {
    display: 'inline-block',
    marginLeft: `${ indent||0 }em`,
    marginRight: '0.5em'
  };
  const { g1, g2 } = getGradientValues(style);
  const gradient = {
    background: `linear-gradient(to right, ${ g1 } 0%,${ g2 } 100%)`
  };

  return (
    <div style={ style } onClick={ onClick } className={ className }>

      <small className='timeDiff' style={{ backgroundColor: g2 }}>
        <i className= {'fa ' + iconRight} style={{ marginRight: '0.5em' }}></i>
        {/*<span style={{ marginLeft: '0.6em' }}>{ labelRight }</span>*/}
        <span style={{ marginLeft: '0.6em' }}>{ labelRight }</span>
        <span className='gradient' style={ gradient }></span>
      </small>

      <div className='actionRowContent'>
        { labelLeft ?
          <i className={ 'fa ' + iconLeft } style={ iconStyles }></i> :
          <i className={ 'fa fa-angle-right' } style={ iconStyles }></i>
        }
        <span>
        <strong>{ labelLeft|| "" }</strong> <small>{ detail }</small>
      </span>
      </div>
    </div>
  );
};

Courtesan.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};
