// @ts-check
import { M, prepareExoClassKit } from '@agoric/vat-data';
import { E } from '@endo/eventual-send';
import { generateSecretCode, makeAssertions } from './utils.js';

export const preparePlayerKit = () => {
  const makePlayerKit = (game) => {
    const { invitationMakers, publicTopics } = game;
    const playerTopics = publicTopics.getPublicTopics();
    const secretCode = publicTopics.getMastermindSecretCode();

    const playerKit = harden({
      publicSubscribers: { game: playerTopics.game },
      invitationMakers,
      secretCode, // NOTE: this method exists only for testing purposes
    });

    return playerKit;
  };
  return makePlayerKit;
};
harden(preparePlayerKit);

/**
 *
 * @param {*} zcf
 * @param {import('@agoric/vat-data').Baggage} baggage
 * @param {import('@agoric/zoe/src/contractSupport/recorder.js').MakeRecorderKit} makeRecorderKit
 * @returns
 */
export const prepareGame = (zcf, baggage, makeRecorderKit) => {
  const makePlayerKit = preparePlayerKit();
  const assertions = makeAssertions();

  const phase = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    FAILED: 'failed',
  };

  const interfaceGuardKit = {
    helper: M.interface('helper', {}, { sloppy: true }),
    publicTopics: M.interface('publicTopics', {}, { sloppy: true }),
    invitationMakers: M.interface('invitationMakers', {}, { sloppy: true }),
    self: M.interface('self', {}, { sloppy: true }),
  };

  const init = (gameNode, seed) => {
    const secretCode = generateSecretCode(seed);
    assertions.assertCode(secretCode);

    const mastermindState = harden({
      guessList: [],
      feedbackList: [],
      attemptsLeft: 10,
      phase: phase.ACTIVE,
      secretCode: secretCode,
    });

    const recorderKit = makeRecorderKit(gameNode);
    E(recorderKit.recorder).write(mastermindState);

    return harden({ recorderKit, secretCode, mastermindState });
  };

  const makeGame = prepareExoClassKit(
    baggage,
    'mastermind game',
    interfaceGuardKit,
    init,
    {
      helper: {
        updateMastermindState(updatedState) {
          const { recorderKit, mastermindState } = this.state;
          const { guessList, feedbackList, attemptsLeft, secretCode } =
            mastermindState;
          const { guessCode, feedback } = updatedState;

          const newPhase =
            feedback.correctPositionCount === 4
              ? phase.COMPLETED
              : attemptsLeft > 1
                ? phase.ACTIVE
                : phase.FAILED;

          const newMastermindState = harden({
            guessList: [...guessList, guessCode],
            feedbackList: [...feedbackList, feedback],
            attemptsLeft: attemptsLeft - 1,
            phase: newPhase,
            secretCode: secretCode,
          });

          // @ts-expect-error
          this.state.mastermindState = newMastermindState;
          E(recorderKit.recorder).write(this.state.mastermindState);
        },
        evaluateGuess(guessCode) {
          const secretCode = this.state.secretCode;
          const digitCountSecretCode = new Map();
          const digitCountGuessCode = new Map();
          let correctPositionCount = 0;
          let correctValueCount = 0;

          for (let i = 0; i < secretCode.length; i++) {
            if (secretCode[i] === guessCode[i]) {
              correctPositionCount++;
            }
          }

          for (let i = 0; i < secretCode.length; i++) {
            digitCountSecretCode.set(
              secretCode[i],
              (digitCountSecretCode.get(secretCode[i]) || 0) + 1
            );
            digitCountGuessCode.set(
              guessCode[i],
              (digitCountGuessCode.get(guessCode[i]) || 0) + 1
            );
          }

          for (const [digit, countSecret] of digitCountSecretCode) {
            const countGuess = digitCountGuessCode.get(digit) || 0;
            correctValueCount += Math.min(countSecret, countGuess);
          }
          correctValueCount -= correctPositionCount;

          return { correctPositionCount, correctValueCount };
        },

        makeGuessHandler(userSeat, offerArgs) {
          const {
            facets: { helper },
            state: { mastermindState },
          } = this;

          if (mastermindState.phase !== phase.ACTIVE) {
            E(userSeat).exit();
            return 'Game finished.';
          }

          const { guessCode } = offerArgs;
          assertions.assertCode(guessCode);
          const feedback = helper.evaluateGuess(guessCode);

          const stateUpdate = {
            guessCode,
            feedback,
          };
          helper.updateMastermindState(stateUpdate);

          switch (this.state.mastermindState.phase) {
            case phase.COMPLETED:
              return 'Congratulations, you won the game.';
            case phase.FAILED:
              return 'Sorry, you lost the game.';
            default:
              return 'Try again.';
          }
        },
      },
      publicTopics: {
        getPublicTopics() {
          const { recorderKit } = this.state;
          return harden({
            game: {
              description: 'Mastermind game',
              subscriber: recorderKit.subscriber,
              storagePath: recorderKit.recorder.getStoragePath(),
            },
          });
        },
        // NOTE: this method exists only for testing purposes
        getMastermindSecretCode() {
          return harden(this.state.secretCode);
        },
      },
      invitationMakers: {
        makeGuessInvitation() {
          return zcf.makeInvitation(
            (seat, offerArgs) =>
              this.facets.helper.makeGuessHandler(seat, offerArgs),
            'make a guess offer'
          );
        },
      },
      self: {
        initPlayerKit() {
          const {
            facets: { publicTopics, invitationMakers },
          } = this;
          const playerKit = makePlayerKit({ publicTopics, invitationMakers });
          return playerKit;
        },
      },
    }
  );

  return harden(makeGame);
};
harden(prepareGame);
