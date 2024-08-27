import colorMap from '../../assets/colorSchema';
import { useGame, useWallet } from '../../hooks';
import './SecretCode.css';

const SecretCode = () => {
  const { subscriber } = useWallet();
  const { secretCode } = useGame(subscriber);

  return (
    <table className="secret-table">
      <tbody>
        <tr>
          {Array.from({ length: 4 }, (_, index) => (
            <td key={index}>
              <div
                className="secret-circle"
                style={{
                  backgroundColor: colorMap[secretCode[index]] || 'grey',
                }}
              ></div>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default SecretCode;
