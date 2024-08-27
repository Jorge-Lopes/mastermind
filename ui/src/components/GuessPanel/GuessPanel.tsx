import Options from '../Options';
import Guess from '../Guess';
import { useGame, useWallet } from '../../hooks';

const Board = () => {
  const { game, subscriber } = useWallet();
  const { feedbackList, phase } = useGame(subscriber);

  console.log(game, subscriber);
  console.log('LOG: feedbackList: ', feedbackList);
  console.log('aqui');

  return (
    <div className="guess-panel-container">
      <Options />
      <Guess phase={phase} gameIndex={game} />
    </div>
  );
};
export default Board;
