const expected            = 10;
const numbers        = [
  7,
  6,
  4,
  4
];
const operators = [
  "/",
  "*",
  "+",
  "-"
];

const useBrackets = true;

const getRandomOperators = (inputNumberLength : number, inputOperators : string[], randomOperatorSet : string[][] = [], previousOperators : string[] = []) : string[][] =>
{
  inputOperators.forEach((inputOperator : string) =>
  {
    const currentOperators = [
      ...previousOperators,
      inputOperator
    ];

    // There can only be operators for the amount of numbers - 1
    if (currentOperators.length === inputNumberLength - 1)
      randomOperatorSet.push(currentOperators);
    else
      getRandomOperators(inputNumberLength, inputOperators, randomOperatorSet, currentOperators);
  });

  return randomOperatorSet;
};

const getRandomNumbers = (inputNumbers : number[], randomNumberSet : number[][] = [], previousNumbers : number[] = []) : number[][] =>
{
  inputNumbers.forEach((inputNumber : number, inputNumberIndex) =>
  {
    const inputNumbersMinusPrevious = [...inputNumbers];
    inputNumbersMinusPrevious.splice(inputNumberIndex, 1);

    // Give the next recurring call the current numbers (previous + current)
    getRandomNumbers(inputNumbersMinusPrevious, randomNumberSet, [
      ...previousNumbers,
      inputNumber
    ]);

    // Final number of input array
    if (inputNumbers.length === 1)
      randomNumberSet.push([
        ...previousNumbers,
        inputNumber
      ]);
  });

  return randomNumberSet;
};

const setBrackets = (randomNumberSet : number[][]) : string[][] =>
{
  const randomNumbersWithBracketsSet : string[][] = [];

  randomNumberSet.forEach((randomNumbers) =>
  {
    for (let i = 0; i < randomNumbers.length; i++)
    {
      // There is never a bracket at the beginning and end of the sum. This reduces the max brackets by 1
      // There is never a bracket immediately after the same randomNumber. This reduces the max brackets by 1
      const baseMaxBracketsPerNumber = randomNumbers.length + (i === 0 ? - 1 : 0) - 1;

      // Every next randomNumber means 1 less bracket
      const bracketCountPerNumber = baseMaxBracketsPerNumber - i;

      if (bracketCountPerNumber > 0)
      {
        for (let b = 1; b <= bracketCountPerNumber; b++)
        {
          const randomNumbersWithBrackets : string[] = [...randomNumbers].map((t) => t.toString());
          randomNumbersWithBrackets[i] = "(" + randomNumbers[i];
          randomNumbersWithBrackets[i + b] = randomNumbers[i + b] + ")";

          randomNumbersWithBracketsSet.push(randomNumbersWithBrackets);
        }
      }
    }
  });

  return randomNumbersWithBracketsSet;
};

const getRandomSums = (inputNumbers : number[], availableSumEditors : string[], useBrackets : boolean) : string[] =>
{
  const randomOperatorSet = getRandomOperators(inputNumbers.length, availableSumEditors);
  let randomNumberSet : number[][] | string[][]   = getRandomNumbers(inputNumbers);

  if (randomOperatorSet.length === 0 || randomNumberSet.length === 0)
    return [];

  if (useBrackets)
    randomNumberSet = setBrackets(randomNumberSet);

  const randomSums : string[] = [];

  randomNumberSet.forEach((randomNumbers) =>
  {
    randomOperatorSet.forEach((randomOperators) =>
    {
      let randomSum = "";

      for (let i = 0; i < randomNumbers.length; i++)
      {
        randomSum += `${randomNumbers[i]}${i === randomNumbers.length - 1 ? "" : randomOperators[i]}`;
      }

      randomSums.push(randomSum);
    });
  });

  return randomSums;
};

const getPossibleSolutions = (inputNumbers : number[], availableSumEditors : string[], expected : number, useBrackets : boolean) : string[] =>
{
  const solutions : string[] = [];

  const randomSums = getRandomSums(inputNumbers, availableSumEditors, useBrackets);

  randomSums.forEach((randomSum) =>
  {
    if (eval(randomSum) === expected)
      solutions.push(randomSum);
  });

  // Make sure we only have unique solutions
  // This can happen when the input contains multiple of the same numbers
  return [...Array.from(new Set(solutions))];
};

getPossibleSolutions(numbers, operators, expected, useBrackets).forEach((solution) =>
{
  console.log(`${solution}=${expected}`);
})
