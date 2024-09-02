import { useState } from 'react';
import colorMap from '../../assets/colorSchema';
import { useAgoric } from '@agoric/react-components';
import { getMakeGuessOfferSpecs } from '../../helpers';
import { useGame, useWallet } from '../../hooks';
import './Guess.css';

const Guess = () => {
  const { game, subscriber } = useWallet();
  const { phase } = useGame(subscriber);

  const { makeOffer } = useAgoric();
  const offerSpec = getMakeGuessOfferSpecs(game);

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
    if (makeOffer && offerSpec) {
      makeOffer(
        offerSpec.invitationSpec,
        {},
        { guessCode: selectedColors },
        offerSpec.onStatusChange
      );
    } else {
      alert('Make Offer Error');
    }
  };

  const isButtonDisabled = phase !== 'active';

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
      <button
        className={`submit-guess-btn ${isButtonDisabled ? 'disabled' : ''}`}
        onClick={submitOffer}
        disabled={isButtonDisabled}
      >
        Submit Guess
      </button>
      <caption className="phase-caption">Game Status: {phase}</caption>
    </div>
  );
};

export default Guess;
