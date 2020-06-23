import { createMachine, assign } from "xstate";

export const timerMachine = createMachine({
  initial: "inactive",
  context: {
    elapsed: 0,
    duration: 5,
    interval: 0.1,
    autoStart: false,
    inactive: false
  },
  states: {
    inactive: {
      on: {
        START: "running",
        "": [
          { target: "running", cond: ctx => !ctx.inactive && ctx.autoStart },
          { target: "paused", cond: ctx => !ctx.autoStart && !ctx.inactive }
        ]
      }
    },
    running: {
      invoke: {
        src: context => cb => {
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000 * context.interval);
          return () => {
            clearInterval(interval);
          };
        }
      },
      on: {
        PAUSE: {
          target: "paused"
        },
        TICK: [
          {
            target: "done",
            cond: (ctx, e) => ctx.elapsed >= ctx.duration
          },
          {
            actions: [
              assign({
                elapsed: context =>
                  +(context.elapsed + context.interval).toFixed(2)
              })
            ]
          }
        ]
      }
    },
    paused: {
      on: {
        RESUME: {
          target: "running"
        },
        RESET: {
          target: "running",
          actions: assign({
            elapsed: 0
          })
        }
      }
    },
    done: {
      entry: ["onDone"],
      type: "final"
    }
  }
});

export const setMachine = createMachine({
  id: "set",
  initial: "getReady",
  states: {
    getReady: { on: { DONE: "working" } },
    working: { on: { DONE: "resting" } },
    resting: { on: { DONE: "completed" } },
    completed: { type: "final", entry: "onDone" }
  }
});
