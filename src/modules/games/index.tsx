import App from './App';
import { PlayerProvider } from './contexts/PlayerContext';

const GamesModule = () => (
  <PlayerProvider>
    <App />
  </PlayerProvider>
);

export default GamesModule;
