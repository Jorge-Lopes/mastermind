import GuessList from '../GuessList';
import Feedback from '../Feedback';
import SecretCode from '../SecretCode';
import './Board.css';

const Board = () => {
  return (
    <div className="board-container">
      <div className="board-top-section">
        <SecretCode />
      </div>
      <div className="board-left-section">
        <GuessList />
      </div>
      <div className="board-right-section">
        <Feedback />
      </div>
    </div>
  );
};
export default Board;
