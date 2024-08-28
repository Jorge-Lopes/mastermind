// @ts-check
import MersenneTwister from 'mersenne-twister';

export const generateSecretCode = seed => {
  const generator = new MersenneTwister(seed);
  const options = 6;
  const secretCode = [];
  for (let i = 0; i < 4; i++) {
    secretCode.push(Math.floor(options * generator.random()));
  }
  return secretCode;
};
harden(generateSecretCode);

export const makeAssertions = () => {
  const assertCode = code => {
    assert(code.length === 4, `Invalid code length: ${code.length}`);

    for (const element of code) {
      assert(typeof element === "number", `Invalid code type: ${element}`);
      assert(element >= 0 && element < 6, `Invalid code value: ${element}`);
    }
  };

  return { assertCode };
};
harden(makeAssertions);
