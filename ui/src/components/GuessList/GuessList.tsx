import colorMap from '../../assets/colorSchema';
import { useGame, useWallet } from '../../hooks';
import './GuessList.css';

const GuessList = () => {
  const { subscriber } = useWallet();
  const { guessList } = useGame(subscriber);

  const getColor = (colorIndex: number | null) => {
    if (colorIndex !== null && colorIndex !== undefined) {
      return colorMap[colorIndex] || 'grey';
    }
    return 'grey';
  };

  return (
    <table className="guess-table">
      <tbody>
        {Array.from({ length: 10 }, (_, index) => (
          <tr key={index}>
            {Array.from({ length: 4 }, (_, i) => {
              const rowIndex = 9 - index;
              const colorIndex = guessList[rowIndex]
                ? guessList[rowIndex][i]
                : null;
              const color = getColor(colorIndex);
              return (
                <td key={i}>
                  <div
                    className="guess-list-circle"
                    style={{ backgroundColor: color }}
                  ></div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GuessList;
