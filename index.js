// tracer property which is a function getting passed an object, returns nothing, emit stuff
import {BaseEmitter} from 'kuker-emitters';
import {
  INPUT_MSG,
  OUTPUTS_MSG,
  DEBUG_MSG,
  MACHINE_CREATION_ERROR_MSG,
  ERROR_MSG,
  INTERNAL_INPUT_MSG,
  INTERNAL_OUTPUTS_MSG,
  INIT_INPUT_MSG,
  WARN_MSG, AUTO_EVENT, INIT_EVENT
} from "kingly";

// Note: dependency with extension
const COURTESAN = '@@Courtesan';

const _emit = BaseEmitter();
const STR_LIMIT = 40;
const emit = x => _emit({...x, type: COURTESAN, indent});
function shortenJSON(data) {
  const str = JSON.stringify(data);

  if (str.length <= STR_LIMIT) return str;
  return str.substr(0, STR_LIMIT) + '...';
};
const formatDetail = detail =>{
  const isDetailNull = Boolean(detail === null);
  return detail && shortenJSON(detail) || isDetailNull && "null" || "undefined"
};
const PREVIEW_STR_LIMIT = 40;

function previewObject(object) {
  const keys = Object.keys(object);

  if (keys.length === 0) return '{}';

  const objectInternals = keys.map(key => {
    if (typeof object[key] === 'object') {
      if (Array.isArray(object[key])) {
        return `${key}: ${ previewArray(object[key]) }`;
      }
      return `${ key }: { ... }`;
    } else if (typeof object[key] === 'string') {
      return `${ key }: "${ String(object[key]) }"`;
    }
    return `${ key }: ${ String(object[key]) }`;
  });

  return `{ ${ objectInternals.join(', ') } }`;
}

function previewArray(array) {
  if (array.length === 0) return '[]';
  return `[...${ array.length }]`;
}

function renderJSONPreview(data, limit = PREVIEW_STR_LIMIT) {
  let result;

  if (typeof data === 'object') {
    result = Array.isArray(data) ? previewArray(data) : previewObject(data);
  } else if (typeof data === 'string') {
    result = `"${ data }"`;
  } else if (typeof data === 'number') {
    result = data;
  } else {
    return null;
  }

  return result.length > limit ? result.substr(0, limit) + '...' : result;
};


let indent = 0;

/**
 * This is the tracer that sends messages to the Courtesan extension.
 * @param obj
 e */
export function tracer(obj) {
  const {type: msgTyepe, trace} = obj || {};
  const {outputs, message, event, error, info, machineState} = trace || {};

  switch (msgTyepe) {
    case INIT_INPUT_MSG: {
      const {cs} = machineState;
      const {eventName, eventData} = info;
      emit({
        msgTyepe,
        left: {label: `Kicking off the machine`, detail: formatDetail(eventData), icon: 'fa-play'},
        right: {label: cs},
        state: machineState,
        event: {[eventName]: eventData},
        color: '#528CE0'
      });
    }
      break;
    case INPUT_MSG: {
      const {cs} = machineState;
      const {eventName, eventData} = info;
      emit({
        msgTyepe,
        left: {label: eventName, detail: formatDetail(eventData), icon: 'fa-arrow-circle-right'},
        right: {label: cs},
        state: machineState,
        event: {[eventName]: eventData},
        color: '#bada55'
      });
      indent++
    }
      break;
    case OUTPUTS_MSG: {
      const {cs} = machineState;
      indent--;
      emit({
        msgTyepe,
        left: {label: "Returns", detail: formatDetail(outputs), icon: 'fa-arrow-circle-left'},
        right: {label: cs},
        state: machineState,
        event: outputs,
        color: '#bada55'
      });
    }
      break;
    case INTERNAL_INPUT_MSG: {
      const {eventName, eventData} = info;
      const {cs} = machineState;
      emit({
        msgTyepe,
        left: {label: eventName === INIT_EVENT? `Taking init transition for compound state ${cs}` : `Taking eventless transition`, detail: formatDetail(eventData), icon: 'fa-sign-in'},
        right: {label: cs},
        state: machineState,
        event,
        color: '#ddedad'
      });
    }
      indent++;
      break;
    case INTERNAL_OUTPUTS_MSG: {
      const {cs} = machineState;
      indent--;
      emit({
        msgTyepe,
        left: {label: "Returns", detail: formatDetail(outputs), icon: 'fa-sign-out'},
        right: {label: cs},
        state: machineState,
        event: outputs,
        color: '#ddedad'
      });
    }
      break;
    case DEBUG_MSG: {
      const {cs} = machineState;
      emit({
        msgTyepe,
        left: {label: message, icon: 'fa-warn'},
        right: {label: cs},
        state: machineState,
        event: {info, message},
        color: '#eef5d6'
      });
    }
      break;
    case ERROR_MSG: {
      const {cs} = machineState;
      emit({
        msgTyepe,
        left: {label: message, icon: 'fa-warn'},
        right: {label: cs},
        state: machineState,
        event: {error, message},
        color: '#cc9900'
      });
    }
      break;
    case MACHINE_CREATION_ERROR_MSG: {
      const {cs} = machineState;
      emit({
        msgTyepe,
        left: {label: message, icon: 'fa-warn'},
        right: {label: cs},
        state: machineState,
        event: {error, info, message},
        color: '#cc0000'
      });
    }
      break;
    case WARN_MSG: {
      const {cs} = machineState;
      emit({
        msgTyepe,
        left: {label: message, icon: 'fa-warn'},
        right: {label: cs},
        state: machineState,
        event: {info, message},
        color: '#ffdaba'
      });
    }
      break;
    default:
      break;
  }
}

// TODO: I should be able to collapse/expend per event/output couple
// TODO: investigate an option render web component, so when I have a render props in outputs, I can show the component
// TODO: and that panel should be cutting horizontally in two the right panel, but will need to import it dynamically...
// TODO: user can pass address of svg of file (graphml if I feel like generating the svg myself, not impossible but time consuming)
//       so I can display that. Also animate the text of the cs when clicked on input
