import { useAgoric } from '@agoric/react-components';
import { getStartGameOfferSpecs } from '../../helpers';
import { useInstance } from '../../hooks';
import './StartGame.css';

const StartGame = () => {
  const { makeOffer } = useAgoric();
  const { instance } = useInstance();
  const offerSpec = getStartGameOfferSpecs(instance);

  const submitOffer = () => {
    return makeOffer?.(
      offerSpec.invitationSpec,
      {},
      undefined,
      offerSpec.onStatusChange,
      offerSpec.offerId
    );
  };
  return (
    <button className="start-game-btn" onClick={submitOffer}>
      Start New Game
    </button>
  );
};

export default StartGame;
