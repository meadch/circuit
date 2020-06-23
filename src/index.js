import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import CircuitSet from "./circuit-set";
import sets from "./sets";
import WorkoutContext from "./workout-context";

const WorkoutComplete = () => (
  <section>
    <h1>Workout Complete!</h1>
  </section>
);

const Workout = ({ sets }) => {
  const [inactive, setInactive] = React.useState(true);
  const [timerState, setTimerState] = React.useState(null);
  const running = timerState && timerState.matches("running");
  const [index, setIndex] = React.useState(0);
  const set = sets[index];

  const onTimerStateChange = state => {
    setTimerState(state);
    if (!state.matches("inactive")) setInactive(false);
  };

  if (!set) return <WorkoutComplete />;

  const onNextSet = () => setIndex(index + 1);
  const onPreviousSet = () => {
    index > 0 && setIndex(index - 1);
  };

  return (
    <section>
      <WorkoutContext.Provider
        value={{
          onTimerStateChange: onTimerStateChange,
          inactive,
          autoStart: running
        }}
      >
        <CircuitSet
          key={set.name}
          {...set}
          onNextSet={onNextSet}
          onTimerStateChange={setTimerState}
        />
        <label>
          <button disabled={running} onClick={onPreviousSet}>
            Back
          </button>
          <button disabled={running} onClick={onNextSet}>
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
