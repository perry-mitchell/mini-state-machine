import { StateMachineContext } from "./factory.js";

export function getState(context: StateMachineContext): string {
    return context.state;
}
