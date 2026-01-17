import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { ShoppingCartIcon, DownloadIcon } from '../components/icons/InterfaceIcons';
import { Purchase } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const USER_PURCHASES_KEY = 'user_purchases';

const MyPurchasesPage: React.FC = () => {
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        const storedPurchases = localStorage.getItem(USER_PURCHASES_KEY);
        if (storedPurchases) {
            setPurchases(JSON.parse(storedPurchases));
        }
    }, []);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center">
                    <ShoppingCartIcon className="h-8 w-8 mr-3 text-[var(--accent-color)]"/> Mis Compras
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Aquí puedes ver el historial de todos tus productos y servicios adquiridos.</p>
            </header>

            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha de Compra</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            {purchases.map(purchase => {
                                const isDownloadable = ['ebook', 'masterclass'].includes(purchase.itemType);
                                return (
                                <tr key={purchase.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{purchase.itemName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-[var(--muted-foreground)]">{purchase.itemType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                                        {format(new Date(purchase.purchaseDate), 'd LLL, yyyy', { locale: es })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">${purchase.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {isDownloadable ? (
                                            <button onClick={() => alert(`Simulando descarga de ${purchase.itemName}`)} className="flex items-center gap-1 text-[var(--accent-color)] hover:underline">
                                                <DownloadIcon className="h-4 w-4" /> Descargar
                                            </button>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    {purchases.length === 0 && (
                        <p className="text-center py-12 text-[var(--muted-foreground)]">No has realizado ninguna compra todavía.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MyPurchasesPage;