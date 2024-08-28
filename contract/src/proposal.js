import { E } from '@endo/eventual-send';

console.warn('start proposal module evaluating');

export const startMastermind = async permittedPowers => {
  console.error('startMastermind...');

  const {
    consume: { board, chainStorage, chainTimerService, startUpgradable },
    installation: {
      consume: { mastermind: mastermindInstallationP },
    },
    instance: {
      produce: { mastermind: mastermindInstance },
    },
  } = permittedPowers;

  const marshaller = await E(board).getPublishingMarshaller();
  const storageNode = await E(chainStorage).makeChildNode('mastermind');

  const privateArgs = harden({ marshaller, storageNode, timer: chainTimerService });
  const installation = await mastermindInstallationP;

  const { instance } = await E(startUpgradable)({
    installation,
    undefined,
    undefined,
    privateArgs,
    label: 'Mastermind',
  });

  console.log('CoreEval script: started contract', instance);

  mastermindInstance.reset();
  mastermindInstance.resolve(instance);

  console.log('mastermind (re)started');
};

const mastermindManifest = {
  [startMastermind.name]: {
    consume: {
      board: true,
      chainStorage: true,
      chainTimerService: true,
      startUpgradable: true,
    },
    installation: {
      consume: {
        mastermind: true,
      },
    },
    instance: {
      produce: {
        mastermind: true,
      },
    },
  },
};
harden(mastermindManifest);

export const getManifestForMastermind = ({ restoreRef }, { contractRef }) => {
  return harden({
    manifest: mastermindManifest,
    installations: {
      mastermind: restoreRef(contractRef),
    },
  });
};
