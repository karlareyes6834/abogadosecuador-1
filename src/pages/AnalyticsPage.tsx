import React from 'react';
import Card from '../components/Card';
import { AnalyticsIcon, CrmIcon, AutomationIcon, ChatbotIcon, UsersIcon, GlobeIcon } from '../components/icons/InterfaceIcons';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KpiCard = ({ title, value, change, icon, color }) => (
    <Card className="!p-4">
        <div className="flex items-center">
            <div className={`p-3 rounded-lg ${color} mr-4`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            {change && <div className={`ml-auto text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </div>}
        </div>
    </Card>
);

const leadsData = [
  { name: 'Lun', leads: 40 },
  { name: 'Mar', leads: 75 },
  { name: 'Mié', leads: 60 },
  { name: 'Jue', leads: 85 },
  { name: 'Vie', leads: 95 },
  { name: 'Sáb', leads: 50 },
  { name: 'Dom', leads: 70 },
];

const trafficData = [
    { name: 'Día 1', users: 2400 },
    { name: 'Día 2', users: 1398 },
    { name: 'Día 3', users: 9800 },
    { name: 'Día 4', users: 3908 },
    { name: 'Día 5', users: 4800 },
    { name: 'Día 6', users: 3800 },
    { name: 'Día 7', users: 4300 },
];

const sourceData = [
  { name: 'Directo', value: 450 },
  { name: 'Google', value: 300 },
  { name: 'Instagram', value: 250 },
];

const COLORS = ['var(--accent-color)', '#a78bfa', '#c4b5fd'];

const AnalyticsPage: React.FC = () => {
    
    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold flex items-center"><AnalyticsIcon className="h-8 w-8 mr-3"/> Analíticas y Reportes</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">Mide lo que importa. Optimiza tus resultados.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="Visitantes Web (7d)" value="12,384" change="+8.1%" icon={<GlobeIcon className="h-6 w-6 text-white"/>} color="bg-blue-500"/>
            <KpiCard title="Nuevos Leads (7d)" value="1,284" change="+12.5%" icon={<CrmIcon className="h-6 w-6 text-white"/>} color="bg-[var(--accent-color)]"/>
            <KpiCard title="Tasa de Conversión" value="10.4%" change="-0.5%" icon={<AnalyticsIcon className="h-6 w-6 text-white"/>} color="bg-green-500"/>
            <KpiCard title="Chats Atendidos (24h)" value="576" change="-1.8%" icon={<ChatbotIcon className="h-6 w-6 text-white"/>} color="bg-pink-500"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h3 className="font-semibold mb-4">Leads por Día (Últimos 7 días)</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leadsData}>
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={12}/>
                            <Tooltip wrapperClassName="!bg-[var(--card)] !border-[var(--border)] !rounded-lg" cursor={{fill: 'var(--accent-color)', fillOpacity: 0.2}}/>
                            <Bar dataKey="leads" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h3 className="font-semibold mb-4">Visitantes Únicos (Últimos 7 días)</h3>
                 <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                            <Tooltip wrapperClassName="!bg-[var(--card)] !border-[var(--border)] !rounded-lg"/>
                            <Legend />
                            <Line type="monotone" dataKey="users" name="Usuarios" stroke="var(--accent-color)" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
             <Card className="lg:col-span-2">
                <h3 className="font-semibold mb-4">Fuentes de Tráfico</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value" paddingAngle={5} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-[var(--card)] !border-[var(--border)] !rounded-lg" />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default AnalyticsPage;