## Modules

<dl>
<dt><a href="#module_MSM">MSM</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Transition">Transition</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#StateMachineConfiguration">StateMachineConfiguration</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#StateMachine">StateMachine</a> : <code>Object</code></dt>
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

<a name="Transition"></a>

## Transition : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the transition, or "action" |
| from | <code>String</code> | The state that the transition should originate from. Can be  set to "*" to indicate all states. |
| to | <code>String</code> | The state that the transition should transition to |

<a name="StateMachineConfiguration"></a>

## StateMachineConfiguration : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| initial | <code>String</code> | The initial state |
| transitions | [<code>Array.&lt;Transition&gt;</code>](#Transition) | An array of transitions |

<a name="StateMachine"></a>

## StateMachine : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pending | <code>Boolean</code> | Whether a transition is currently pending or not |
| state | <code>String</code> | The current state the machine is in |
| can | <code>function</code> | Check if a transition is possible |
| cannot | <code>function</code> | Check if a transition is not possible |
| is | <code>function</code> | Check if the machine is in a state |
| off | <code>function</code> | Turn a event listener off (remove) |
| on | <code>function</code> | Attach an event listener |
| once | <code>function</code> | Attach a single-use event listener |
| transition | <code>function</code> | Transition the machine to another state |

