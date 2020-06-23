import * as React from "react";
import { useMachine } from "@xstate/react";
import { timerMachine } from "./machines";
import WorkoutContext from "./workout-context";

const Timer = ({ duration, onDone }) => {
  const context = React.useContext(WorkoutContext);
  const [state, send] = useMachine(
    timerMachine
      .withContext({
        duration,
        elapsed: 0,
        interval: 0.1,
        inactive: context.inactive,
        autoStart: context.autoStart
      })
      .withConfig({ actions: { onDone } })
  );

  React.useEffect(() => {
    context.onTimerStateChange(state);
  }, [state, context]);

  const { elapsed } = state.context;

  return (
    <section>
      <section>
        <label>
          <output>
            {elapsed.toFixed(1)}s / {duration.toFixed(1)}s
          </output>
          <progress max={duration} value={elapsed} />
        </label>
        <label>
          {/* {state.matches("inactive") ? ( */}
          <button
            disabled={!state.matches("inactive")}
            onClick={e => {
              send("START");
            }}
          >
            Start
          </button>
          <label>
            <button
              disabled={state.matches("inactive") || state.matches("paused")}
              onClick={e => {
                send("PAUSE");
              }}
            >
              Pause
            </button>
            <button
              disabled={state.matches("inactive") || state.matches("running")}
              onClick={e => {
                send("RESUME");
              }}
            >
              Resume
            </button>
            <button
              disabled={state.matches("inactive") || state.matches("running")}
              onClick={_ => send("RESET")}
            >
              Reset
            </button>
          </label>
        </label>
      </section>
    </section>
  );
};

export default Timer;
