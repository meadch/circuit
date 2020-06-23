import * as React from "react";
import { useMachine } from "@xstate/react";
import { setMachine } from "./machines";
import Timer from "./timer";

const GetReady = ({ onDone, timerDuration }) => (
  <section>
    Get Ready
    <Timer duration={timerDuration} onDone={onDone} />
  </section>
);

const Working = ({ onDone, timerDuration }) => (
  <section>
    Working
    <Timer duration={timerDuration} onDone={onDone} />
  </section>
);

const Resting = ({ onDone, timerDuration, onPause, onResume }) => (
  <section>
    Resting
    <Timer duration={timerDuration} onDone={onDone} />
  </section>
);

const CircuitSet = ({
  name,
  onNextSet,
  onPreviousSet,
  getReadyDuration,
  workDuration,
  restDuration
}) => {
  const machine = setMachine.withConfig({ actions: { onDone: onNextSet } });
  const [state, send] = useMachine(machine);
  const done = () => {
    send("DONE");
  };

  return (
    <section>
      {name}
      {state.matches("getReady") && (
        <GetReady onDone={done} timerDuration={getReadyDuration} />
      )}
      {state.matches("working") && (
        <Working onDone={done} timerDuration={workDuration} />
      )}
      {state.matches("resting") && (
        <Resting onDone={done} timerDuration={restDuration} />
      )}
    </section>
  );
};

export default CircuitSet;
