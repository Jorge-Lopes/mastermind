// @ts-check
import { prepareExo, provide } from '@agoric/vat-data';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/index.js';
import { E } from '@endo/eventual-send';
import { M } from '@endo/patterns';
import { prepareGame } from './mastermind.js';

/**
 * @param {*} zcf
 * @param {*} privateArgs
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @returns
 */
export const prepare = async (zcf, privateArgs, baggage) => {
  
  const { storageNode, marshaller, timer } = privateArgs;
  const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
  const makeGame = prepareGame(zcf, baggage, makeRecorderKit);
  provide(baggage, 'games count', () => 0);

  const makeGameNode = async () => {
    const gamesCount = baggage.get('games count');
    return E(storageNode).makeChildNode(`game${gamesCount}`);
  };

  const makeGameHandle = async () => {
    const [gameNode, seed] = await Promise.all([
      makeGameNode(),
      E(timer).getCurrentTimestamp(),
    ]);

    const game = makeGame(gameNode, seed);
    const playerKit = game.self.initPlayerKit();
    return playerKit;
  };

  const makeGameInvitation = () => {
    return zcf.makeInvitation(makeGameHandle, 'Make mastermind game');
  };

  const publicFacet = prepareExo(
    baggage,
    'mastermind publicFacet',
    M.interface('PublicFacetI', {
      makeGameInvitation: M.call().returns(M.promise()),
    }),
    { makeGameInvitation },
  );

  const creatorFacet = prepareExo(
    baggage,
    'mastermind creatorFacet',
    M.interface('CreatorFacetI', {}),
    {},
  );

  return harden({ publicFacet, creatorFacet });
};
harden(prepare);
prepare;
