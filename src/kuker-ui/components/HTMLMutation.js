/* eslint-ignore max-len */
import React from 'react';
import PropTypes from 'prop-types';
import normalizeMutationPathParts from '../helpers/normalizeMutationPathParts';
import SingleMutation from './SingleMutation';

/*
kind - indicates the kind of change; will be one of the following:
  N - indicates a newly added property/element
  D - indicates a property/element was deleted
  E - indicates a property/element was edited
  A - indicates a change occurred within an array
path - the property path (from the left-hand-side root)
lhs - the value on the left-hand-side of the comparison (undefined if kind === 'N')
rhs - the value on the right-hand-side of the comparison (undefined if kind === 'D')
index - when kind === 'A', indicates the array index where the change occurred
item - when kind === 'A', contains a nested change record indicating the change that occurred at the array index
*/

function convertPathPartsToItems(path, tree) {
  const arr = [];
  var cursor = tree;

  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    let item, childrenIndex = null;

    if (part === 'children') {
      item = cursor[part][path[i + 1]];
      if (item && Array.isArray(cursor[part]) && cursor[part].length > 1) {
        childrenIndex = path[i + 1];
      }
      i++;
    } else {
      item = cursor[part];
    }
    if (item) {
      cursor = item;
      arr.push(item.name ?
        childrenIndex !== null ? `<${ item.name }.${ childrenIndex }>` : `<${ item.name }>` :
        part
      );
    } else {
      arr.push(part);
    }
  }
  return arr;
}
function normalizeMutationPath(mutations, state, filter) {
  var r, isThereAnyFilter = filter && filter !== '';

  if (isThereAnyFilter) {
    r = new RegExp(filter, 'i');
  }

  return normalizeMutationPathParts(
    mutations.map(({ path, ...rest }) => ({
      ...rest,
      path: path ? convertPathPartsToItems(path, state) : path,
      filterRegExp: r
    })),
    r
  );
}

export default function HTMLMutation({ pinnedEvent, filter }) {
  var mutations = pinnedEvent.stateMutation;

  if (!mutations) return null;

  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        normalizeMutationPath(mutations, pinnedEvent.state, filter)
          .map((mutation, i) => <div key={i}><SingleMutation mutation={ mutation } /></div>)
      }
    </div>
  );
};

HTMLMutation.propTypes = {
  pinnedEvent: PropTypes.object,
  filter: PropTypes.string
};
