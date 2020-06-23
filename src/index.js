import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import CircuitSet from "./circuit-set";
import sets from "./sets";
import { useMachine } from "@xstate/react";
import { workoutMachine } from "./machines";
import WorkoutContext from "./workout-context";

const WorkoutComplete = ({ onBack }) => (
  <section>
    <h1>Workout Complete!</h1>
    <button onClick={onBack}>Back</button>
  </section>
);

const Workout = ({ sets }) => {
  const [state, send] = useMachine(workoutMachine);
  const [index, setIndex] = React.useState(0);
  const set = sets[index];

  const onTimerStateChange = timerState => {
    switch (timerState.event.type) {
      case "START":
        return send(timerState.event);
      case "PAUSE":
        return send(timerState.event);
      case "RESUME":
        return send(timerState.event);
      default:
        return;
    }
  };

  const onNextSet = () => setIndex(index + 1);
  const onPreviousSet = () => {
    index > 0 && setIndex(index - 1);
  };

  if (!set) return <WorkoutComplete onBack={onPreviousSet} />;

  console.log(state);
  return (
    <section>
      <WorkoutContext.Provider
        value={{
          onTimerStateChange: onTimerStateChange,
          workoutState: state
        }}
      >
        <label>
          Round {set.round}, Set {set.setNum}
        </label>
        <CircuitSet key={set.name} {...set} onNextSet={onNextSet} />
        <label>
          <button disabled={state.matches("active")} onClick={onPreviousSet}>
            Back
          </button>
          <button disabled={state.matches("active")} onClick={onNextSet}>
            Next
          </button>
        </label>
      </WorkoutContext.Provider>
    </section>
  );
};

const App = () => {
  return <Workout sets={sets} />;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
