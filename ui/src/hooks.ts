import { useAgoric } from '@agoric/react-components';
import { AgoricChainStoragePathKind as Kind } from '@agoric/rpc';
import { useCallback, useEffect, useState } from 'react';
import { formatFeedbackList } from './helpers';

type InstanceType = unknown; // Replace `unknown` with the actual type
type OfferSubscribersType = Record<string, Record<string, string>>;
type GameType = {
  secretCode: any[];
  feedbackList: any[];
  guessList: any[];
  attemptsLeft: number | null;
  phase: string;
};

export const useInstance = () => {
  const [instance, setInstance] = useState<InstanceType | null>(null);
  const { chainStorageWatcher } = useAgoric();

  const updateInstance = useCallback(
    (instances: Array<[string, InstanceType]>) => {
      const mastermindInstance = instances.find(
        ([name]) => name === 'mastermind'
      );
      if (mastermindInstance) {
        setInstance(mastermindInstance[1]);
      }
    },
    []
  );

  useEffect(() => {
    if (!chainStorageWatcher) return;

    const watchInstance = chainStorageWatcher.watchLatest<
      Array<[string, InstanceType]>
    >([Kind.Data, 'published.agoricNames.instance'], updateInstance);

    return () => {
      watchInstance();
    };
  }, [chainStorageWatcher, updateInstance]);

  return { instance };
};

export const useWallet = () => {
  const [game, setGame] = useState<string | null>(null);
  const [subscriber, setSubscriber] = useState<string | null>(null);

  const { offerIdsToPublicSubscribers } = useAgoric();

  const updateGameAndSubscriber = useCallback(
    (offerSubscribers: OfferSubscribersType) => {
      const gamesList: string[] = [];
      const subscribersList: string[] = [];

      Object.entries(offerSubscribers).forEach(([key, value]) => {
        if (key.includes('start_game')) {
          gamesList.push(key);
          subscribersList.push(value.game);
        }
      });

      if (gamesList.length > 0 && subscribersList.length > 0) {
        setGame(gamesList[gamesList.length - 1]);
        setSubscriber(subscribersList[subscribersList.length - 1]);
      }
    },
    []
  );

  useEffect(() => {
    if (!offerIdsToPublicSubscribers) return;

    updateGameAndSubscriber(offerIdsToPublicSubscribers);
  }, [offerIdsToPublicSubscribers, updateGameAndSubscriber]);

  return { game, subscriber };
};

export const useGame = (subscriber: string | null) => {
  const [secretCode, setSecretCode] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [guessList, setGuessList] = useState<any[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>('');

  const { chainStorageWatcher } = useAgoric();

  const updateGameState = useCallback((game: GameType) => {
    if (game) {
      setSecretCode((prev) =>
        prev !== game.secretCode ? game.secretCode : prev
      );
      setPhase((prev) => (prev !== game.phase ? game.phase : prev));
      setAttemptsLeft((prev) =>
        prev !== game.attemptsLeft ? game.attemptsLeft : prev
      );
      setGuessList((prev) => (prev !== game.guessList ? game.guessList : prev));

      const formattedFeedbackList = formatFeedbackList(game.feedbackList);
      setFeedbackList((prev) =>
        prev !== formattedFeedbackList ? formattedFeedbackList : prev
      );
    }
  }, []);

  useEffect(() => {
    if (!chainStorageWatcher || !subscriber) return;

    const watchGame = chainStorageWatcher.watchLatest<GameType>(
      [Kind.Data, subscriber],
      updateGameState
    );

    return () => {
      watchGame?.();
    };
  }, [chainStorageWatcher, subscriber, updateGameState]);

  return { secretCode, feedbackList, guessList, attemptsLeft, phase };
};
