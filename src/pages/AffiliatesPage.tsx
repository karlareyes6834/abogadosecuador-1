import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { AffiliateIcon, CopyIcon, CheckIcon } from '../components/icons/InterfaceIcons';
import { AffiliateStats, Referral, UserRole } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const AFFILIATE_DATA_KEY = 'nexuspro_affiliate_data';

// Mock data generation
const generateMockData = (): { stats: AffiliateStats, referrals: Referral[] } => ({
  stats: {
    userId: 'current_user',
    referralCode: 'WILSONIPALES2024',
    clicks: 142,
    signups: 12,
    earnings: 249.50,
  },
  referrals: [
    { id: 'ref_1', name: 'Maria Rodriguez', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'converted', commission: 25.00 },
    { id: 'ref_2', name: 'Juan Gonzalez', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'converted', commission: 25.00 },
    { id: 'ref_3', name: 'Luisa Martinez', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending', commission: 0 },
  ]
});

const KpiCard = ({ title, value, prefix = '' }) => (
    <Card>
        <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
        <p className="text-3xl font-bold">{prefix}{value}</p>
    </Card>
);

const AffiliatesPage: React.FC<{userRole: UserRole}> = ({ userRole }) => {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem(AFFILIATE_DATA_KEY);
        if (storedData) {
            const parsed = JSON.parse(storedData);
            setStats(parsed.stats);
            setReferrals(parsed.referrals);
        } else {
            const mockData = generateMockData();
            localStorage.setItem(AFFILIATE_DATA_KEY, JSON.stringify(mockData));
            setStats(mockData.stats);
            setReferrals(mockData.referrals);
        }
    }, []);

    const handleCopy = () => {
        if (stats) {
            const referralLink = `https://nexuspro.io/register?ref=${stats.referralCode}`;
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    if (!stats) {
        return <div>Cargando datos de afiliados...</div>;
    }

    const AdminView = () => (
        <Card className="!p-0">
             <h2 className="text-xl font-bold p-4">Todos los Referidos</h2>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead className="bg-[var(--background)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre del Referido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Comisión</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                       {referrals.map(ref => (
                           <tr key={ref.id}>
                               <td className="px-6 py-4 font-medium">{ref.name}</td>
                               <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{format(new Date(ref.date), 'd LLL yyyy', { locale: es })}</td>
                               <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${ref.status === 'converted' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{ref.status === 'converted' ? 'Convertido' : 'Pendiente'}</span></td>
                               <td className="px-6 py-4 text-sm font-semibold text-green-600">{ref.commission > 0 ? `$${ref.commission.toFixed(2)}` : '-'}</td>
                           </tr>
                       ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const ClientView = () => (
        <>
            <Card>
                <h2 className="text-xl font-bold mb-2">Tu Enlace de Referido Único</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">Comparte este enlace. Cuando alguien se registre y compre un plan, ganarás una comisión.</p>
                <div className="flex items-center gap-2 p-3 bg-[var(--background)] rounded-lg">
                    <input type="text" readOnly value={`https://nexuspro.io/register?ref=${stats.referralCode}`} className="flex-grow bg-transparent focus:outline-none font-mono text-sm" />
                    <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                        {copied ? <CheckIcon className="h-4 w-4 mr-2" /> : <CopyIcon className="h-4 w-4 mr-2" />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Ganancias Totales" value={stats.earnings.toFixed(2)} prefix="$" />
                <KpiCard title="Registros Convertidos" value={stats.signups} />
                <KpiCard title="Clics en tu Enlace" value={stats.clicks} />
            </div>

            <Card className="!p-0">
                 <h2 className="text-xl font-bold p-4">Tus Referidos Recientes</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre del Referido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Comisión</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                           {referrals.map(ref => (
                               <tr key={ref.id}>
                                   <td className="px-6 py-4 font-medium">{ref.name}</td>
                                   <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{format(new Date(ref.date), 'd LLL yyyy', { locale: es })}</td>
                                   <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${ref.status === 'converted' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{ref.status === 'converted' ? 'Convertido' : 'Pendiente'}</span></td>
                                   <td className="px-6 py-4 text-sm font-semibold text-green-600">{ref.commission > 0 ? `$${ref.commission.toFixed(2)}` : '-'}</td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center">
                    <AffiliateIcon className="h-8 w-8 mr-3"/> Programa de Afiliados
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">
                    {userRole === 'admin' 
                        ? 'Gestiona todos los afiliados y sus referidos.' 
                        : 'Gana comisiones refiriendo nuevos clientes a la plataforma.'
                    }
                </p>
            </div>
            
            {userRole === 'admin' ? <AdminView /> : <ClientView />}

        </div>
    );
};

export default AffiliatesPage;