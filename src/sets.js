const movements = [
  {
    name: "Push-ups",
    getReadyDuration: 4,
    workDuration: 8,
    restDuration: 5
  },
  {
    name: "Burpees",
    getReadyDuration: 4,
    workDuration: 5,
    restDuration: 6
  },
  {
    name: "Kettlebell Swings",
    getReadyDuration: 7,
    workDuration: 8,
    restDuration: 9
  }
];

const withRounds = rounds => movements =>
  Array(rounds)
    .fill()
    .reduce((accum, val, i) => {
      return accum.concat(
        movements.map((m, j) => ({ ...m, round: i + 1, setNum: j + 1 }))
      );
    }, []);

export default withRounds(3)(movements);
