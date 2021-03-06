# Motivation
This package supports the Kingly state machine library with a tracing extension. Kingly has a devtool which is very strongly inspired from the previous excellent work of Krasimir Tsonev with [Kuker](https://chrome.google.com/webstore/detail/kuker/glgnienmpgmfpkigngkmieconbnkmlcn). 

Kingly developers must first download the [courtesan extension](https://chrome.google.com/webstore/search/courtesan) of the Chrome store. Then, for Kingly to send messages to the dev tool, you will need to create a Kingly state machine as follows:

```js
import {tracer} from "courtesan";
      ...
const fsm = createStateMachine(fsmDef, {debug:{console}, devTool:{tracer}});
```

As you can see, the `devTool` parameter admits the `tracer` property whose interface is implemented by the `courtesan` library.


# Screenshot

![screenshot](https://brucou.github.io/documentation/images/extension/courtesan%200.png)

# Credit
This dev tool is extensively based on [prior art](https://github.com/krasimir/kuker) from [Krasimir Tsonev](https://krasimirtsonev.com/). Krasimir has a ton of nice software that can be used for fun and profit. He is als the author of the [Stent](https://www.smashingmagazine.com/2018/01/rise-state-machines/) state machine library (designed to integrate smoothly with Redux). 
