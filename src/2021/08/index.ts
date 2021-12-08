import readInput, { readDemoInput } from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();

const sorted = (input: string) => input.split('').sort().join('');
/**
 * Parse input | output and make sure each signal is sorted (for comparison later)
 */
const parse = (input) =>
  input.split('\n').map((v) =>
    v
      .split('|')
      .map((v) => v.trim())
      .map((v) => v.split(' ').map(sorted)),
  );
const input = parse(rawInput);
const demoInput = parse(readDemoInput());

/* Functions */
function part1(values: string[][][]): number {
  const desiredLengths = [2, 4, 3, 7];
  return values.reduce(
    (totalSum, [signalPatterns, outputs]) =>
      totalSum + outputs.reduce((sum, i) => sum + (desiredLengths.includes(i.length) ? 1 : 0), 0),
    0,
  );
}

const intersection = (a: string, b: string) => [...new Set(a)].filter((x) => b.includes(x)).join('');
const difference = (a: string, b: string) => [...a].filter((x) => !b.includes(x)).join('');
// const union = (a, b) => [...new Set([...a, ...b])].join('');
const union = (...args: string[]) => {
  const combinedArgs = args.reduce((a, b) => a + b);
  return [...new Set(combinedArgs)].join('');
};

/**
 * 2 intersected with 5 is 8, 3 does not do this with 2 or 5 thus when I find the intersection of 8 (size 7) I know the other signal is a 3
 */
const identifyThree = (signals: string[]) => {
  const twoOrThreeOrFive = signals.filter((item) => item.length === 5);
  let [a, b, c] = twoOrThreeOrFive;

  if (union(a, b).length === 7) {
    return c;
  } else if (union(a, c).length === 7) {
    return b;
  } else {
    return a;
  }
};

const identifyTwoAndFive = (signals: string[], three: string, e: string) => {
  const two = signals.find((item) => item.length === 5 && item.includes(e));
  const five = signals.find((item) => item.length === 5 && item !== two && item !== three);
  return [two, five];
};

/**
 * Letter to signal mapping referenced in code 
 *    0:      1:      2:      3:      4:
 *   aaaa    ....    aaaa    aaaa    ....
 *  b    c  .    c  .    c  .    c  b    c
 *  b    c  .    c  .    c  .    c  b    c
 *   ....    ....    dddd    dddd    dddd
 *  e    f  .    f  e    .  .    f  .    f
 *  e    f  .    f  e    .  .    f  .    f
 *   gggg    ....    gggg    gggg    ....

 *    5:      6:      7:      8:      9:
 *   aaaa    aaaa    aaaa    aaaa    aaaa
 *  b    .  b    .  .    c  b    c  b    c
 *  b    .  b    .  .    c  b    c  b    c
 *   dddd    dddd    ....    dddd    dddd
 *  .    f  e    f  .    f  e    f  .    f
 *  .    f  e    f  .    f  e    f  .    f
 *   gggg    gggg    ....    gggg    gggg
 * @param signals 
 * @returns 
 */
const getNumberMapping = (signals: string[]) => {
  const one = signals.find((item) => item.length === 2);
  const three = identifyThree(signals);
  const four = signals.find((item) => item.length === 4);
  const seven = signals.find((item) => item.length === 3);
  const eight = signals.find((item) => item.length === 7);
  const nine = sorted(union(three, four));
  //   const a = difference(seven, one); // unused
  const e = difference(eight, nine);
  const [two, five] = identifyTwoAndFive(signals, three, e);
  const bOrD = difference(four, one);
  const d = intersection(bOrD, two);
  //   const b = difference(bOrD, d); // unused
  const zero = sorted(difference(eight, d));
  const six = signals.find((item) => item.length === 6 && item !== nine && item !== zero);

  return {
    [sorted(one)]: 1,
    [sorted(two)]: 2,
    [sorted(three)]: 3,
    [sorted(four)]: 4,
    [sorted(five)]: 5,
    [sorted(six)]: 6,
    [sorted(seven)]: 7,
    [sorted(eight)]: 8,
    [sorted(nine)]: 9,
    [sorted(zero)]: 0,
  };
};

function part2(values: string[][][]): number {
  return values.reduce((sum, [input, output]) => {
    const outputMapping = getNumberMapping(input);
    const finalNumber = parseInt(output.map((v) => outputMapping[sorted(v)]).join(''), 10);
    return sum + finalNumber;
  }, 0);
}

/* Tests */

assert.strictEqual(part1(demoInput), 26);
assert.strictEqual(part1(input), 548);

assert.strictEqual(
  part2(parse('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf')),
  5353,
);
assert.strictEqual(
  part2(parse('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf')),
  5353,
);
assert.strictEqual(
  part2(parse('edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc')),
  9781,
);
assert.strictEqual(part2(parse('fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg')), 1197);
assert.strictEqual(
  part2(parse('fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb')),
  9361,
);
assert.strictEqual(
  part2(parse('aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea')),
  4873,
);
assert.strictEqual(
  part2(parse('fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb')),
  8418,
);
assert.strictEqual(
  part2(parse('dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe')),
  4548,
);
assert.strictEqual(
  part2(parse('bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef')),
  1625,
);
assert.strictEqual(part2(demoInput), 61229);

/* Results */

console.time('Time');
const resultPart1 = part1(input);
const resultPart2 = part2(input);

console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
