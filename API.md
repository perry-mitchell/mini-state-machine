## Modules

<dl>
<dt><a href="#module_MSM">MSM</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#AttachedEventHandlerResult">AttachedEventHandlerResult</a></dt>
<dd></dd>
<dt><a href="#StateMachine">StateMachine</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Transition">Transition</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#HistoryItem">HistoryItem</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#StateMachineConfiguration">StateMachineConfiguration</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_MSM"></a>

## MSM
<a name="module_MSM.createStateMachine"></a>

### MSM.createStateMachine(config) ⇒ [<code>StateMachine</code>](#StateMachine)
Create a state machine instance

**Kind**: static method of [<code>MSM</code>](#module_MSM)  
**Returns**: [<code>StateMachine</code>](#StateMachine) - A state machine instance  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>StateMachineConfiguration</code>](#StateMachineConfiguration) | Configuration for the new state machine |

<a name="AttachedEventHandlerResult"></a>

## AttachedEventHandlerResult
**Kind**: global class  
<a name="AttachedEventHandlerResult.remove"></a>

### AttachedEventHandlerResult.remove()
Remove the event handler

**Kind**: static method of [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult)  
<a name="StateMachine"></a>

## StateMachine
**Kind**: global class  

* [StateMachine](#StateMachine)
    * [.pending](#StateMachine.pending) : <code>Boolean</code>
    * [.state](#StateMachine.state) : <code>String</code>
    * [.can(transition)](#StateMachine.can) ⇒ <code>Boolean</code>
    * [.cannot(transition)](#StateMachine.cannot) ⇒ <code>Boolean</code>
    * [.getHistory()](#StateMachine.getHistory) ⇒ [<code>Array.&lt;HistoryItem&gt;</code>](#HistoryItem)
    * [.is(state)](#StateMachine.is) ⇒ <code>Boolean</code>
    * [.off(event, stateOrTransition, cb)](#StateMachine.off)
    * [.on(event, stateOrTransition, cb)](#StateMachine.on) ⇒ [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult)
    * [.once(event, stateOrTransition, cb)](#StateMachine.once) ⇒ [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult)
    * [.transition(action)](#StateMachine.transition) ⇒ <code>Promise</code>

<a name="StateMachine.pending"></a>

### StateMachine.pending : <code>Boolean</code>
Whether the machine is currently transitioning or not

**Kind**: static property of [<code>StateMachine</code>](#StateMachine)  
<a name="StateMachine.state"></a>

### StateMachine.state : <code>String</code>
The current state the machine is in

**Kind**: static property of [<code>StateMachine</code>](#StateMachine)  
<a name="StateMachine.can"></a>

### StateMachine.can(transition) ⇒ <code>Boolean</code>
Check if the state machine can perform a transition

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: <code>Boolean</code> - True if the transition can be performed, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| transition | <code>String</code> | The transition name to check |

<a name="StateMachine.cannot"></a>

### StateMachine.cannot(transition) ⇒ <code>Boolean</code>
Check if the state machine cannot perform a transition

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: <code>Boolean</code> - True if it cannot be performed, false if it can  

| Param | Type | Description |
| --- | --- | --- |
| transition | <code>String</code> | The transition name to check |

<a name="StateMachine.getHistory"></a>

### StateMachine.getHistory() ⇒ [<code>Array.&lt;HistoryItem&gt;</code>](#HistoryItem)
Get the state machine's history

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: [<code>Array.&lt;HistoryItem&gt;</code>](#HistoryItem) - An array of history entries  
<a name="StateMachine.is"></a>

### StateMachine.is(state) ⇒ <code>Boolean</code>
Test if the state machine is in a particular state

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: <code>Boolean</code> - True if it is in the mentioned state  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>String</code> | The state to check |

<a name="StateMachine.off"></a>

### StateMachine.off(event, stateOrTransition, cb)
Turn off an event listener

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event type to turn off (before/after etc.) |
| stateOrTransition | <code>String</code> | The state or transition name to turn off the listener for |
| cb | <code>function</code> | The calback that was passed to `on` or `once` |

<a name="StateMachine.on"></a>

### StateMachine.on(event, stateOrTransition, cb) ⇒ [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult)
Attach (turn on) an event listener for a particular event

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult) - An event handler control adapter  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event type to attach to (before/after etc.) |
| stateOrTransition | <code>String</code> | The state or transition name to attach a listener on |
| cb | <code>function</code> | The callback to attach |

<a name="StateMachine.once"></a>

### StateMachine.once(event, stateOrTransition, cb) ⇒ [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult)
Attach a single-use event listener for a particular event
This event, once caught, will clear the attached handler.

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: [<code>AttachedEventHandlerResult</code>](#AttachedEventHandlerResult) - An event handler control adapter  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event type to attach to (before/after etc.) |
| stateOrTransition | <code>String</code> | The state or transition name to attach a listener on |
| cb | <code>function</code> | The callback to attach |

<a name="StateMachine.transition"></a>

### StateMachine.transition(action) ⇒ <code>Promise</code>
Perform a state transition

**Kind**: static method of [<code>StateMachine</code>](#StateMachine)  
**Returns**: <code>Promise</code> - A promise that resolves once the transition is complete  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>String</code> | The action to perform which will result in a transition |

<a name="Transition"></a>

## Transition : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the transition, or "action" |
| from | <code>String</code> | The state that the transition should originate from. Can be  set to "*" to indicate all states. |
| to | <code>String</code> | The state that the transition should transition to |

<a name="HistoryItem"></a>

## HistoryItem : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tsStart | <code>Number</code> | The starting timestamp |
| tsEnd | <code>Number</code> | The ending timestamp |
| state | <code>String</code> | The state that was transitioned to |
| previous | <code>String</code> | The previous state |
| transition | <code>String</code> | The transition name that was invoked |

<a name="StateMachineConfiguration"></a>

## StateMachineConfiguration : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initial | <code>String</code> | The initial state |
| transitions | [<code>Array.&lt;Transition&gt;</code>](#Transition) | An array of transitions |

