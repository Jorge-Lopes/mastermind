import { test } from './prepare-test-env-ava.js';
import { E } from '@endo/far';
import { makeHelpers } from './utils.js';

test.before(async (t) => {
  const helpers = makeHelpers();
  const setup = await helpers.setup(t);
  t.context = { ...setup, helpers };
});

test('single attempt', async (t) => {
  const { zoe, publicFacet, helpers } = t.context;

  const invitation = await E(publicFacet).makeGameInvitation();
  const userSeat = await E(zoe).offer(invitation);
  const { invitationMakers, publicSubscribers } =
    await E(userSeat).getOfferResult();

  const guess = [1, 2, 3, 3];
  const result = await helpers.makeGuess(zoe, invitationMakers, guess);
  t.deepEqual(result, 'Try again.');

  const mastermindState = await helpers.getMastermindState(publicSubscribers);

  t.deepEqual(mastermindState.guessList, [guess], 'Invalid guessList');
  t.deepEqual(mastermindState.attemptsLeft, 9, 'Invalid attemptsLeft');
  t.deepEqual(mastermindState.phase, 'active', 'Invalid phase');
});

test('win game', async (t) => {
  const { zoe, publicFacet, helpers } = t.context;

  const invitation = await E(publicFacet).makeGameInvitation();
  const userSeat = await E(zoe).offer(invitation);
  const { invitationMakers, publicSubscribers } =
    await E(userSeat).getOfferResult();

  const guess = await helpers.getSecretCode(publicSubscribers);
  const feedback = await helpers.makeGuess(zoe, invitationMakers, guess);
  t.deepEqual(feedback, 'Congratulations, you won the game.');

  const mastermindState = await helpers.getMastermindState(publicSubscribers);

  t.deepEqual(mastermindState.guessList, [guess], 'Invalid guessList');
  t.deepEqual(mastermindState.attemptsLeft, 9, 'Invalid attemptsLeft');
  t.deepEqual(mastermindState.phase, 'completed', 'Invalid phase');
});

test('try to send invalid guess', async (t) => {
  const { zoe, publicFacet, helpers } = t.context;

  const invitation = await E(publicFacet).makeGameInvitation();
  const userSeat = await E(zoe).offer(invitation);
  const { invitationMakers } = await E(userSeat).getOfferResult();

  // try to send guess with invalid length
  let guess = [1, 2];
  let throwPromise = helpers.makeGuess(zoe, invitationMakers, guess);

  let error = await t.throwsAsync(throwPromise);
  t.deepEqual(error.message, 'Invalid code length: 2');

  // try to send guess with invalid values
  guess = [1, 8, 2, 1];
  throwPromise = helpers.makeGuess(zoe, invitationMakers, guess);

  error = await t.throwsAsync(throwPromise);
  t.deepEqual(error.message, 'Invalid code value: 8');

  // try to send guess with invalid type
  guess = [1, 'a', 2, 1];
  throwPromise = helpers.makeGuess(zoe, invitationMakers, guess);

  error = await t.throwsAsync(throwPromise);
  t.deepEqual(error.message, 'Invalid code type: a');
});

test('try to play after game won', async (t) => {
  const { zoe, publicFacet, helpers } = t.context;

  const invitation = await E(publicFacet).makeGameInvitation();
  const userSeat = await E(zoe).offer(invitation);
  const { invitationMakers, publicSubscribers } =
    await E(userSeat).getOfferResult();

  const guess = await helpers.getSecretCode(publicSubscribers);
  await helpers.makeGuess(zoe, invitationMakers, guess);

  let mastermindState = await helpers.getMastermindState(publicSubscribers);
  t.deepEqual(mastermindState.phase, 'completed', 'Invalid phase');

  // try new attempt after game completed
  const feedback = await helpers.makeGuess(zoe, invitationMakers, [1, 2, 3, 4]);
  t.deepEqual(feedback, 'Game finished.');

  mastermindState = await helpers.getMastermindState(publicSubscribers);

  t.deepEqual(mastermindState.guessList, [guess], 'Invalid guessList');
  t.deepEqual(mastermindState.attemptsLeft, 9, 'Invalid attemptsLeft');
  t.deepEqual(mastermindState.phase, 'completed', 'Invalid phase');
});

test('try to play after 10 guesses', async (t) => {
  const { zoe, publicFacet, helpers } = t.context;

  const invitation = await E(publicFacet).makeGameInvitation();
  const userSeat = await E(zoe).offer(invitation);
  const { invitationMakers, publicSubscribers } =
    await E(userSeat).getOfferResult();

  /* make 10 guesses ()
   *  ToDo: add condition to prevent guess = secretCode */
  for (let i = 0; i < 10; i++) {
    const guess = helpers.generateRandomGuess();
    console.log('iteration', i, 'guess', guess);
    await helpers.makeGuess(zoe, invitationMakers, guess);

    const mastermindState = await helpers.getMastermindState(publicSubscribers);
    t.deepEqual(mastermindState.attemptsLeft, 9 - i, 'Invalid attemptsLeft');
  }

  const mastermindState = await helpers.getMastermindState(publicSubscribers);
  t.deepEqual(mastermindState.attemptsLeft, 0, 'Invalid attemptsLeft');
  t.deepEqual(mastermindState.phase, 'failed', 'Invalid phase');

  // try new attempt after 10 guesses
  const guess = helpers.generateRandomGuess();
  const result = await helpers.makeGuess(zoe, invitationMakers, guess);
  t.deepEqual(result, 'Game finished.');
});

test('secret code generator', async (t) => {
  const { zoe, publicFacet, chainTimerService, helpers } = t.context;

  let invitation = await E(publicFacet).makeGameInvitation();
  let userSeat = await E(zoe).offer(invitation);
  const { publicSubscribers: ps_1 } = await E(userSeat).getOfferResult();
  const secretCode_1 = await helpers.getSecretCode(ps_1);

  chainTimerService.tick(1000000000);
  invitation = await E(publicFacet).makeGameInvitation();
  userSeat = await E(zoe).offer(invitation);
  const { publicSubscribers: ps_2 } = await E(userSeat).getOfferResult();
  const secretCode_2 = await helpers.getSecretCode(ps_2);

  t.notDeepEqual(secretCode_1, secretCode_2, 'Invalid secret code');
});
