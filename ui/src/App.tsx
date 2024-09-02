import { AgoricProvider } from '@agoric/react-components';
import { wallets } from 'cosmos-kit';
import { ThemeProvider, useTheme } from '@interchain-ui/react';
import Navbar from './components/Navbar';
import StartGame from './components/StartGame';
import Board from './components/Board';
import GuessPanel from './components/GuessPanel';
import './App.css';
import '@agoric/react-components/dist/style.css';

const agoricLocal = {
  testChain: {
    chainId: 'agoriclocal',
    chainName: 'agoric-local',
  },
  apis: {
    rest: ['http://localhost:1317'],
    rpc: ['http://localhost:26657'],
  },
};

function App() {
  const { themeClass } = useTheme();

  return (
    <ThemeProvider>
      <div className={themeClass}>
        <AgoricProvider
          wallets={wallets.extension}
          agoricNetworkConfigs={[agoricLocal]}
          defaultChainName="agoric-local"
        >
          <div className="main-container">
            <div className="main-top">
              <Navbar />
            </div>
            <div className="main-left">
              <StartGame />
            </div>
            <div className="main-center">
              <Board />
            </div>
            <div className="main-right">
              <GuessPanel />
            </div>
          </div>
        </AgoricProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
