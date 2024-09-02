import { useGame, useWallet } from '../../hooks';
import './Feedback.css';

const getColor = (row: Array<number>, colorIndex: number) => {
  const [redCount, whiteCount] = row || [0, 0];
  const color =
    colorIndex < redCount
      ? 'black'
      : colorIndex < redCount + whiteCount
        ? 'red'
        : 'grey';
  return color;
};

const Feedback = () => {
  const { subscriber } = useWallet();
  const { feedbackList } = useGame(subscriber);

  return (
    <table className="feedback-table">
      <tbody>
        {Array.from({ length: 10 }, (_, index) => {
          const rowIndex = 9 - index;
          const row = feedbackList[rowIndex] || [];

          return (
            <tr key={index}>
              <td>
                <div className="feedback-circle-container">
                  <div className="feedback-circle-row">
                    <div
                      className="feedback-circle"
                      style={{ backgroundColor: getColor(row, 0) }}
                    ></div>
                    <div
                      className="feedback-circle"
                      style={{ backgroundColor: getColor(row, 1) }}
                    ></div>
                  </div>
                  <div className="feedback-circle-row">
                    <div
                      className="feedback-circle"
                      style={{ backgroundColor: getColor(row, 2) }}
                    ></div>
                    <div
                      className="feedback-circle"
                      style={{ backgroundColor: getColor(row, 3) }}
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Feedback;
