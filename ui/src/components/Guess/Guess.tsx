import { useState } from 'react';
import colorMap from '../../assets/colorSchema';
import { useAgoric } from '@agoric/react-components';
import { getMakeGuessOfferSpecs } from '../../helpers';
import './Guess.css';

type Props = {
  phase: string;
  gameIndex: string | null;
};

const Guess = ({ phase, gameIndex }: Props) => {
  const { makeOffer } = useAgoric();
  const offerSpec = getMakeGuessOfferSpecs(gameIndex);

  const [selectedColors, setSelectedColors] = useState<(number | string)[]>(
    new Array(4).fill('')
  );

  const handleColorChange = (index: number, colorIndex: string) => {
    setSelectedColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[index] = Number(colorIndex);
      return updatedColors;
    });
  };

  const getColorStyle = (colorIndex: number | string) => {
    return colorMap[colorIndex] || 'grey';
  };

  const submitOffer = () => {
    if (makeOffer) {
      makeOffer(
        offerSpec.invitationSpec,
        {},
        { guessCode: selectedColors },
        offerSpec.onStatusChange
      );
    }
  };

  return (
    <div className="guess-container">
      <table>
        <tbody>
          <tr>
            {selectedColors.map((_, index) => (
              <td key={index}>
                <div className="guess-cell-wrapper">
                  <div
                    className="guess-circle"
                    style={{
                      backgroundColor: getColorStyle(selectedColors[index]),
                    }}
                  />
                  <select
                    className="color-selector"
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    value={selectedColors[index]}
                  >
                    <option value="">-</option>
                    {Object.keys(colorMap).map((colorKey, i) => (
                      <option key={colorKey} value={i}>
                        {colorKey}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button className="submit-guess-btn" onClick={submitOffer}>
        Submit Guess
      </button>
    </div>
  );
};

export default Guess;
