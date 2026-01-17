import GamesPage from '../pages/GamesPage';
import GamesIntegrationPage from '../pages/GamesIntegrationPage';
import GamesHubProfessional from '../components/GamesHubProfessional';
import GameStoreIntegrado from '../components/GameStoreIntegrado';

export const gamesRoutes = [
  {
    path: '/games',
    element: <GamesPage />,
    label: '🎮 Games'
  },
  {
    path: '/juegos',
    element: <GamesIntegrationPage />,
    label: '🎮 Centro de Juegos'
  },
  {
    path: '/juegos/hub',
    element: <GamesHubProfessional />,
    label: '🎮 Hub de Juegos'
  },
  {
    path: '/juegos/tienda',
    element: <GameStoreIntegrado />,
    label: '🛒 Tienda de Tokens'
  }
];

export default gamesRoutes;
