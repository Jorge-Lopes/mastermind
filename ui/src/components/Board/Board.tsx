import GuessList from '../GuessList';
import Feedback from '../Feedback';
import SecretCode from '../SecretCode';
import './Board.css';

const Board = () => {
  return (
    <div>
      <div>
        <SecretCode />
      </div>
      <div className="board-panel">
        <div>
          <GuessList />
        </div>
        <div>
          <Feedback />
        </div>
      </div>
    </div>
  );
};
export default Board;
