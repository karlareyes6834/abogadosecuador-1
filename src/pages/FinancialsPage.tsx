import React, { useState } from 'react';
import Card from '../components/Card';
import { FinancialsIcon, PlusIcon, ReceiptIcon, PiggyBankIcon, ChartDonutIcon, CreditsIcon, ShoppingCartIcon } from '../components/icons/InterfaceIcons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

type Tab = 'dashboard' | 'transactions' | 'goals';

const data = [
  { name: 'Ene', income: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', income: 3000, expenses: 1398, profit: 1602 },
  { name: 'Mar', income: 2000, expenses: 3800, profit: -1800 },
  { name: 'Abr', income: 2780, expenses: 3908, profit: -1128 },
  { name: 'May', income: 4890, expenses: 4800, profit: 90 },
  { name: 'Jun', income: 5390, expenses: 3800, profit: 1590 },
];

const pieData = [
  { name: 'Marketing', value: 400 },
  { name: 'Software', value: 300 },
  { name: 'Equipo', value: 300 },
  { name: 'Oficina', value: 200 },
];

const COLORS = {
    purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    green: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
};


const AddTransactionModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Añadir Transacción</h2>
            <form className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]">
                        <option>Ingreso</option>
                        <option>Gasto</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Monto</label>
                    <input type="number" placeholder="0.00" className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <input type="text" placeholder="Ej: Venta de Curso de Marketing" className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Vincular a (Opcional)</label>
                    <select className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]">
                        <option>Nada</option>
                        <optgroup label="Productos">
                            <option>Curso de Marketing Digital</option>
                        </optgroup>
                        <optgroup label="Contactos (CRM)">
                            <option>Alice Johnson</option>
                            <option>Bob Williams</option>
                        </optgroup>
                    </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" onClick={(e)=>{e.preventDefault(); onClose()}} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Añadir</button>
                </div>
            </form>
        </Card>
    </div>
);

const FinancialsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const TabButton = ({ tabId, label, icon }) => (
        <button onClick={() => setActiveTab(tabId)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><FinancialsIcon className="h-8 w-8 mr-3"/> Finanzas</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Controla tus ingresos, gastos y metas financieras.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Añadir Transacción
                </button>
            </div>

            <div className="p-1 bg-[var(--background)] rounded-lg inline-flex items-center gap-1">
                <TabButton tabId="dashboard" label="Dashboard" icon={<FinancialsIcon className="h-4 w-4"/>}/>
                <TabButton tabId="transactions" label="Transacciones" icon={<ReceiptIcon className="h-4 w-4"/>}/>
                <TabButton tabId="goals" label="Metas de Ahorro" icon={<PiggyBankIcon className="h-4 w-4"/>}/>
            </div>

            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <h3 className="font-bold">Ingresos vs Gastos</h3>
                        <div className="h-80 w-full mt-4">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                                    <YAxis stroke="var(--muted-foreground)" fontSize={12}/>
                                    <Tooltip wrapperClassName="!bg-[var(--card)] !border-[var(--border)] !rounded-lg" cursor={{fill: 'var(--accent-color)', fillOpacity: 0.2}}/>
                                    <Legend />
                                    <Bar dataKey="income" fill="hsl(142 71% 45%)" name="Ingresos" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" fill="hsl(0 84% 60%)" name="Gastos" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold flex items-center"><ShoppingCartIcon className="h-5 w-5 mr-2 text-emerald-500"/> Ingresos por Ventas</h3>
                            <p className="text-2xl font-bold text-emerald-500 mt-2">$23,450.00</p>
                            <p className="text-xs text-[var(--muted-foreground)]">Total generado por el módulo de Ventas.</p>
                        </Card>
                        <Card>
                             <h3 className="font-bold flex items-center"><CreditsIcon className="h-5 w-5 mr-2 text-yellow-500"/> Créditos (Pasivo)</h3>
                             <p className="text-2xl font-bold text-yellow-500 mt-2">$1,230.00</p>
                             <p className="text-xs text-[var(--muted-foreground)]">Valor total de créditos pendientes de clientes.</p>
                        </Card>
                        <Card>
                            <h3 className="font-bold flex items-center"><ChartDonutIcon className="h-5 w-5 mr-2"/> Gastos por Categoría</h3>
                            <div className="h-40 w-full mt-2">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} innerRadius={30} outerRadius={50} fill="#8884d8" dataKey="value" paddingAngle={5}>
                                        {pieData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS.purple[index % COLORS.purple.length]} />
                                        ))}
                                      </Pie>
                                      <Tooltip wrapperClassName="!bg-[var(--card)] !border-[var(--border)] !rounded-lg" />
                                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right"/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
            {activeTab === 'transactions' && <Card><p>Lista de transacciones...</p></Card>}
            {activeTab === 'goals' && <Card><p>Metas de ahorro...</p></Card>}
        </div>
    );
};

export default FinancialsPage;