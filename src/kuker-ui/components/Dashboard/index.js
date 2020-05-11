import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import NoEvents from './NoEvents';
import Settings from './Settings';
import { AutoSizer, List } from 'react-virtualized';
import EventListRow from './EventListRow';
import Event from './Event';
import State from './State';
import QuickFilter from './QuickFilter';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._rowRenderer = this._rowRenderer.bind(this);
    this.state = {
      settingsVisibility: false
    };
  }
  _changeSettingsVisibility() {
    this.setState({ settingsVisibility: !this.state.settingsVisibility });
  }
  _rowRenderer(eventsToRender, { index, isScrolling, isVisible, key, parent, style }) {
    const { pinnedEvent, pin, sources } = this.props;

    return (
      <div key={ key } style={style} >
        <EventListRow
          event={ eventsToRender[index] }
          pinnedEvent={ pinnedEvent }
          pin={ pin }
          sources={ sources }
        />
      </div>
    );
  }
  render() {
    const {
      clear,
      marker,
      navViewState,
      navViewEvent,
      navViewAnalysis,
      navState,
      events,
      filteredEvents,
      pinnedEvent,
      quickLeftFilter
    } = this.props;
    const hasEvents = quickLeftFilter !== '' || filteredEvents.length > 0;

    return (
      <div className='dashboard'>
        <div className={ 'logLeft' + (!hasEvents ? ' fullWidth' : '') }>
          <div className='logNav'>
            { hasEvents && <a onClick={ () => marker() } key='marker' className='ml05 mr1 try2'>
              <i className='fa fa-bookmark'></i>
            </a> }
            { hasEvents && <a onClick={ () => clear() } key='clear' className='mr1 try2'>
              <i className='fa fa-ban'></i>
            </a> }
            { events.length > 0 && <a onClick={ () => this._changeSettingsVisibility() }
              key='s'
              className='right mr05 try2'>
              <i className='fa fa-gear'></i>
            </a> }
          </div>
          { hasEvents && <QuickFilter whichOne='left' /> }
          { hasEvents && <ul className='log'>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={ l => (this.list = l) }
                  rowRenderer={ (...args) => this._rowRenderer(filteredEvents, ...args) }
                  height={ height }
                  rowCount={ filteredEvents.length }
                  rowHeight={ 28 }
                  width={ width }
                  scrollToIndex={ !pinnedEvent ? -1 : filteredEvents.findIndex(e => e.id === pinnedEvent.id) }/>
              )}
            </AutoSizer>
          </ul>
          }
          { !hasEvents && <NoEvents /> }
          { this.state.settingsVisibility && (
            <Settings onClose={ () => this._changeSettingsVisibility() } />
          ) }
        </div>
        { hasEvents && <div className='logRight'>
          <div className='logNav fullWidth' key='nav'>
            <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>
              <i className='fa fa-heart mr05'></i>Machine state</a>
            <a onClick={ navViewEvent } className={ navState === 'event' ? 'selected' : null }>
              <i className='fa fa-dot-circle-o mr05'></i>Details</a>
            { // <a onClick={ navViewAnalysis } className={ navState === 'analysis' ? 'selected' : null }>
              // <i className='fa fa-bar-chart-o mr05'></i>Analysis</a>
            }
          </div>
          <QuickFilter whichOne='right' />
          { navState === 'state' ? <State pinnedEvent={ pinnedEvent } /> : null }
          { navState === 'event' ? <Event event={ pinnedEvent } /> : null }
          { navState === 'analysis' ? 'Work in progress ...' : null }
        </div> }
      </div>
    );
  }
};

Dashboard.propTypes = {
  pin: PropTypes.func,
  clear: PropTypes.func,
  marker: PropTypes.func,
  pinnedEvent: PropTypes.object,
  events: PropTypes.array,
  filteredEvents: PropTypes.array,
  sources: PropTypes.object,
  navViewState: PropTypes.func,
  navViewEvent: PropTypes.func,
  navViewAnalysis: PropTypes.func,
  clearMutation: PropTypes.func,
  updateFilterTypes: PropTypes.func,
  navState: PropTypes.string,
  mutationExplorerPath: PropTypes.string,
  quickLeftFilter: PropTypes.string,
  healthy: PropTypes.bool
};

export default connect(Dashboard)
  .with('DevTools', 'TreeNav', 'Pinned')
  .map((devTools, treeNav, pinned) => ({
    // devtools
    events: devTools.state.events,
    filteredEvents: devTools.getFilteredEvents(),
    clear: () => devTools.flushEvents(),
    marker: () => pinned.addMarker(),
    sources: devTools.state.sources,
    quickLeftFilter: devTools.state.quickFilters.left,
    // tree nav
    navViewState: treeNav.viewState,
    navViewEvent: treeNav.viewEvent,
    navViewAnalysis: treeNav.viewAnalysis,
    navState: treeNav.state.name,
    // pinned
    pin: id => pinned.pin(id),
    pinnedEvent: pinned.state.pinnedEvent
  }));
