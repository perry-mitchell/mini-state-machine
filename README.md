# Mini-State-Machine
> A tiny Finite State Machine

[![Build Status](https://travis-ci.org/perry-mitchell/mini-state-machine.svg?branch=master)](https://travis-ci.org/perry-mitchell/mini-state-machine) [![npm version](https://badge.fury.io/js/mini-state-machine.svg)](https://www.npmjs.com/package/mini-state-machine)

## About

State machines are extremely useful pieces of functionality that ensure some state of a custom system. Using state machines (or _Finite State Machines_) allows you to define states for a system and all possible transitions between those states, ensuring the system follows only a certain amount of paths between states. An attempt to deviate from the allowed paths will always result in an error (as well as the initial state being preserved).

### Why

Existing solutions were a bit too bloated for my use case - I needed a small and functional state machine with asynchronous transitions. Mini-State-Machine is my take on the bare minimum. If you have suggestions on how I could make it smaller, please create an issue!

Currently the NodeJS version is **less than 5kb minified!**

### Usage

Usage is simple: Create a state machine instance and you're ready to go!

```javascript
const { createStateMachine } = require("mini-state-machine");

const sm = createStateMachine({
    initial: "hidden",
    transitions: [
        { name: "show", from: "hidden", to: "shown" },
        { name: "load", from "shown", to: "loaded" },
        { name: "hide", from: "*", to: "hidden" }
    ]
});

await sm.transition("show");
sm.state; // "shown"

await sm.transition("show"); // Exception: No path for this transition
```

Event handlers can be attached so each transition can be watched using callbacks. Transitions can be **cancelled** in the `"before"` and `"leave"` callback types by either returning `false` or throwing an error (or rejecting a `Promise`).

```javascript
sm.on("before", "show", () => {
    if (someTest()) {
        // cancel show
        return false;
    }
});

sm.on("leave", "hidden", () => {
    throw new Error("Some error");
    // or
    return Promise.reject(new Error("Some error"));
});
```

_By throwing an error, the original `transition()` call will be rejected with that error._

The methods `off(type, stateOrTransitionName, callback)` and `once(type, stateOrTransitionName, callback)` are also available and function like normal event emitter properties. `on()` and `once` also return an Object that contains a `remove` property method, which removes the listener when called.

## Installation

Run the following to install:

```
npm install mini-state-machine --save
```

_This library supports **NodeJS 6** as a minimum compatible version_.

Check out the [API documentation](API.md) for more information.

### Usage in the browser

The default `main` path in the `package.json` is for Node, but a precompiled web version can be had at `mini-state-machine/dist/msm.web.js`. The web version uses the UMD package system, and exports a library called `MSM`. You can use `MSM.createStateMachine` to create state machines.

The browser version is built targeting Internet Explorer 11 as a minimum compatible browser.
