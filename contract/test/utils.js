/* eslint-disable import/no-extraneous-dependencies */

import { Buffer } from 'buffer';
import { promisify } from 'util';
import { gzip } from 'zlib';

import { makeFakeStorageKit } from '@agoric/internal/src/storage-test-utils.js';
import { eventLoopIteration } from '@agoric/notifier/tools/testSupports.js';
import { makeFakeBoard } from '@agoric/vats/tools/board-utils.js';
import buildManualTimer from '@agoric/zoe/tools/manualTimer.js';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';
import bundleSource from '@endo/bundle-source';
import { E } from '@endo/far';
import path from 'path';

export const makeHelpers = () => {
  const setup = async t => {
    const filename = new URL(import.meta.url).pathname;
    const dirname = path.dirname(filename);
    const contractPath = `${dirname}/../src/index.js`;
    const contractBundle = await bundleSource(contractPath);

    const { zoeService: zoe, feeMintAccess } = makeZoeKitForTest();

    const rootPath = 'root';
    const { rootNode } = makeFakeStorageKit(rootPath);
    const storageNode = rootNode.makeChildNode('mastermind');
    const board = makeFakeBoard();
    const marshaller = board.getReadonlyMarshaller();
    const timer = buildManualTimer(t.log);

    const privateArgs = harden({ storageNode, marshaller, timer });

    const installation = E(zoe).install(contractBundle);
    const { creatorFacet, publicFacet, instance } = await E(zoe).startInstance(
      installation,
      undefined,
      undefined,
      privateArgs,
    );

    return {
      zoe,
      feeMintAccess,
      creatorFacet,
      publicFacet,
      instance,
    };
  };

  const makeGuess = async (zoe, invitationMakers, guess) => {
    const guessInvitation = await E(invitationMakers).makeGuessInvitation();
    const guessOfferArgs = harden({ guessCode: guess });

    const guessSeat = await E(zoe).offer(
      guessInvitation,
      undefined,
      undefined,
      guessOfferArgs,
    );
    const feedback = await E(guessSeat).getOfferResult();

    return feedback;
  };

  const getMastermindState = async publicTopics => {
    await eventLoopIteration();

    const mastermindSubscriber = await E(publicTopics).getMastermindState();
    const mastermindState = await E(
      mastermindSubscriber.subscriber,
    ).getUpdateSince();

    return mastermindState.value;
  };

  const getSecretCode = async publicTopics => {
    return E(publicTopics).getMastermindSecretCode();
  };

  const generateRandomGuess = () => {
    const guess = [];
    for (let i = 0; i < 4; i++) {
      guess.push(Math.floor(Math.random() * 6));
    }
    return guess;
  };

  return { setup, makeGuess, getMastermindState, getSecretCode, generateRandomGuess };
};

/**
 * @typedef {import('fs').promises['readFile']} PromisifiedFSReadFile
 */

/** @param {PromisifiedFSReadFile} readFile */
export const makeCompressFile = readFile => async filePath => {
  const fileContents = await readFile(filePath, 'utf8');
  const buffer = Buffer.from(fileContents, 'utf-8');
  const compressed = await promisify(gzip)(buffer);
  return compressed;
};
