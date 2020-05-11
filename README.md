# Motivation
This package supports the Kingly state machine library with a tracing extension. Kingly has a devtool which is very strongly inspired from the previous excellent work of Krasimir Tsonev with [Kuker](https://chrome.google.com/webstore/detail/kuker/glgnienmpgmfpkigngkmieconbnkmlcn). 

Kingly developers must first download the [courtesan extension](https://chrome.google.com/webstore/search/courtesan) of the Chrome store. Then, for Kingly to send messages to the dev tool, you will need to create a Kingly state machine as follows:

```js
import {tracer} from "Kingly";
      ...
const fsm = createStateMachine(fsmDef, {debug:{console}, devTool:{tracer}});
```

As you can see, the `devTool` parameter admits the `tracer` property. The corresponding tracer object can be imported from the Kingly library.  


# Screenshot

![screenshot](https://brucou.github.io/documentation/images/extension/courtesan%200.png)
