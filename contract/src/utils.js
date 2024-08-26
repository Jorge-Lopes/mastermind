// @ts-check
import MersenneTwister from 'mersenne-twister';

let debugInstance = 1;

/**
 * @param {string} name
 * @param {boolean | 'verbose'} enable
 */
export const makeTracer = (name, enable = true) => {
  debugInstance += 1;
  let debugCount = 1;
  const key = `----- ${name}.${debugInstance} `;
  // the cases below define a named variable to provide better debug info
  switch (enable) {
    case false: {
      const logDisabled = (..._args) => {};
      return logDisabled;
    }
    case 'verbose': {
      const infoTick = (optLog, ...args) => {
        if (optLog.log) {
          console.info(key, (debugCount += 1), ...args);
        } else {
          console.info(key, (debugCount += 1), optLog, ...args);
        }
      };
      return infoTick;
    }
    default: {
      const debugTick = (optLog, ...args) => {
        if (optLog.log) {
          optLog.log(key, (debugCount += 1), ...args);
        } else {
          console.info(key, (debugCount += 1), optLog, ...args);
        }
      };
      return debugTick;
    }
  }
};
harden(makeTracer);

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
