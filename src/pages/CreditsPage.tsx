import React, { useState } from 'react';
import Card from '../components/Card';
import { CreditsIcon, PlusIcon, CheckIcon, CrmIcon } from '../components/icons/InterfaceIcons';
import { useCredits } from '../context/CreditContext';


const RedeemCreditsModal = ({ currentCredits, onClose }) => {
    const { deductCredits } = useCredits();
    const [amountToRedeem, setAmountToRedeem] = useState(0);
    const purchaseAmount = 49.99;
    
    const handleRedeem = (e) => {
        e.preventDefault();
        deductCredits(amountToRedeem);
        onClose();
    }

    const finalPrice = Math.max(0, purchaseAmount - (amountToRedeem * 0.10)); // Assuming 10 credits = $1

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Canjear Créditos</h2>
                <form className="space-y-4" onSubmit={handleRedeem}>
                    <div className="p-4 bg-[var(--background)] rounded-lg">
                        <div className="flex justify-between text-sm"><span>Total de la Compra</span><span>${purchaseAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm text-red-500"><span>Descuento por Créditos</span><span>-${(amountToRedeem * 0.10).toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-[var(--border)]"><span>Total a Pagar</span><span>${finalPrice.toFixed(2)}</span></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Créditos a usar (disponibles: {currentCredits.toLocaleString()})</label>
                        <input 
                            type="number"
                            value={amountToRedeem}
                            onChange={(e) => setAmountToRedeem(Math.min(currentCredits, Number(e.target.value)))}
                            max={currentCredits}
                            className="mt-1 block w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                    </div>
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Confirmar Compra</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const CreditRuleCard = ({ title, description, credits }) => (
    <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] flex items-center">
        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-md mr-4">
            <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400"/>
        </div>
        <div className="flex-grow">
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
        </div>
        <p className="font-bold text-lg text-[var(--accent-color)]">+{credits}</p>
    </div>
);

const CreditsPage: React.FC = () => {
    const { credits, addCredits } = useCredits();
    const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

    const handlePurchase = (amount: number) => {
        addCredits(amount);
        alert(`¡Has comprado ${amount.toLocaleString()} créditos!`);
    };

    return (
        <div className="space-y-8">
            {isRedeemModalOpen && <RedeemCreditsModal currentCredits={credits} onClose={() => setIsRedeemModalOpen(false)} />}
            <div>
                <h1 className="text-3xl font-bold flex items-center">
                    <CreditsIcon className="h-8 w-8 mr-3 text-[var(--accent-color)]"/> Sistema de Créditos
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Gestiona y recarga tu saldo para usar las funciones de IA.</p>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 text-center flex flex-col justify-center">
                    <p className="text-lg text-[var(--muted-foreground)]">Tu Saldo Actual</p>
                    <p className="text-6xl font-bold my-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                        {credits.toLocaleString()}
                    </p>
                    <p className="text-[var(--muted-foreground)]">créditos</p>
                    <button onClick={() => setIsRedeemModalOpen(true)} className="mt-4 w-full px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Canjear Créditos</button>
                </Card>
                 <Card className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Reglas para Ganar Créditos</h2>
                    <div className="space-y-3">
                        <CreditRuleCard title="Bono de Bienvenida" description="Al registrarse por primera vez." credits={1000} />
                        <CreditRuleCard title="Primera Compra" description="Por la primera compra de un plan." credits={500} />
                        <CreditRuleCard title="Invitar a un Amigo" description="Cuando un referido se registra." credits={250} />
                    </div>
                 </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Comprar Créditos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <Card className="text-center">
                        <h3 className="text-2xl font-bold text-[var(--accent-color)]">5,000</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4">Créditos</p>
                        <p className="text-xl font-semibold mb-6">$10</p>
                        <button onClick={() => handlePurchase(5000)} className="w-full px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Comprar</button>
                    </Card>
                    <Card className="text-center border-2 border-[var(--accent-color)] shadow-[var(--accent-color)]/20">
                         <h3 className="text-2xl font-bold text-[var(--accent-color)]">12,000</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4">Créditos</p>
                        <p className="text-xl font-semibold mb-6">$20</p>
                        <button onClick={() => handlePurchase(12000)} className="w-full px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Comprar</button>
                    </Card>
                     <Card className="text-center">
                         <h3 className="text-2xl font-bold text-[var(--accent-color)]">30,000</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4">Créditos</p>
                        <p className="text-xl font-semibold mb-6">$45</p>
                        <button onClick={() => handlePurchase(30000)} className="w-full px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Comprar</button>
                    </Card>
                     <Card className="text-center">
                         <h3 className="text-2xl font-bold text-[var(--accent-color)]">100,000</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-4">Créditos</p>
                        <p className="text-xl font-semibold mb-6">$120</p>
                        <button onClick={() => handlePurchase(100000)} className="w-full px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Comprar</button>
                    </Card>
                </div>
            </div>

            <Card>
                <h2 className="text-2xl font-bold mb-4">Historial de Transacciones</h2>
                 <p className="text-[var(--muted-foreground)]">Aquí se mostrará tu historial de compra y uso de créditos.</p>
                {/* Placeholder for transaction history */}
            </Card>
        </div>
    );
};

export default CreditsPage;