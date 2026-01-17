import React from 'react';
import Card from '../components/Card';
import { PuzzleIcon } from '../components/icons/InterfaceIcons'; // Using PuzzleIcon as a placeholder for rewards

const RewardsPage: React.FC = () => {
    return (
        <div className="space-y-6 p-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <PuzzleIcon className="h-8 w-8 mr-3 text-yellow-500"/> Centro de Recompensas
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Canjea tus puntos por descuentos, productos y más.</p>
            </header>
            <Card>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold">Próximamente</h2>
                    <p className="text-gray-500 mt-2">Estamos construyendo un emocionante centro de recompensas para ti.</p>
                </div>
            </Card>
        </div>
    );
};

export default RewardsPage;
