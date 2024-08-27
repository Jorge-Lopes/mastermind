import colorMap from '../../assets/colorSchema';
import './Options.css';

const Options = () => {
  return (
    <div className="options-container">
      {Object.entries(colorMap).map(([index, color]) => (
        <div key={index} className="option" style={{ backgroundColor: color }}>
          <span>{index}</span>
        </div>
      ))}
    </div>
  );
};

export default Options;
