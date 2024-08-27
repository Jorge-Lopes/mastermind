import { ConnectWalletButton } from '@agoric/react-components';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="title-container">
        <h1 className="title"> Mastermind </h1>
      </div>
      <div>
        <ConnectWalletButton className="connect-wallet-btn" />
      </div>
    </nav>
  );
};

export default Navbar;
