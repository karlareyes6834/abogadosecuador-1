import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import { CampaignIcon, PlusIcon, FacebookIcon, CalendarViewIcon, XIcon, LinkedInIcon, InstagramIcon, UploadCloudIcon, TrashIcon, WandIcon, CheckCircleIcon, VideoIcon, StoryIcon, SettingsIcon, DownloadIcon, YoutubeIcon, TikTokIcon } from '../components/icons/InterfaceIcons';
import { format, endOfMonth, endOfWeek, eachDayOfInterval, isSameMonth, add } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { generateSocialPost } from '../services/geminiService';
import { useCredits } from '../context/CreditContext';
import { Page, PublicRoute } from '../types';

type ServiceId = 'facebook' | 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok';

interface ConnectedAccount {
    id: string;
    serviceId: ServiceId;
    name: string;
}
interface Post {
    id: number;
    date: Date;
    text: string;
    image: string | null;
    accounts: string[]; // Array of ConnectedAccount IDs
    contentType: 'post' | 'story' | 'video';
}

const serviceConfig: Record<ServiceId, { icon: React.FC<any>, name: string, color: string }> = {
    facebook: { icon: FacebookIcon, name: 'Facebook', color: 'text-blue-600' },
    instagram: { icon: InstagramIcon, name: 'Instagram', color: 'text-pink-500' },
    x: { icon: XIcon, name: 'X', color: 'text-black dark:text-white' },
    linkedin: { icon: LinkedInIcon, name: 'LinkedIn', color: 'text-blue-700' },
    youtube: { icon: YoutubeIcon, name: 'YouTube', color: 'text-red-600' },
    tiktok: { icon: TikTokIcon, name: 'TikTok', color: 'text-black dark:text-white' },
};

const CreatePostModal = ({ date, onClose, onSave, connectedAccounts }) => {
    const [text, setText] = useState('');
    const [time, setTime] = useState(format(new Date(), 'HH:mm'));
    const [image, setImage] = useState<string | null>(null);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [contentType, setContentType] = useState<'post' | 'story' | 'video'>('post');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { credits, deductCredits } = useCredits();

    const handleAccountToggle = (accountId: string) => {
        setSelectedAccounts(prev => 
            prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]
        );
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = () => {
        if(!text.trim() || selectedAccounts.length === 0) {
            alert('Por favor, escribe un texto y selecciona al menos una cuenta para publicar.');
            return;
        }
        const [hours, minutes] = time.split(':').map(Number);
        const finalDate = new Date(date);
        finalDate.setHours(hours, minutes, 0, 0);

        onSave({ date: finalDate, text, image, accounts: selectedAccounts, contentType });
    };

    const handleGenerateText = async () => {
        if (isAiLoading || credits < 10) return;
        setIsAiLoading(true);
        if (deductCredits(10)) {
            const prompt = text || `un post sobre marketing digital para la fecha ${format(date, 'd LLLL')}`;
            const generatedText = await generateSocialPost(prompt);
            setText(generatedText);
        }
        setIsAiLoading(false);
    };

    const groupedAccounts = connectedAccounts.reduce((acc, account) => {
        (acc[account.serviceId] = acc[account.serviceId] || []).push(account);
        return acc;
    }, {} as Record<ServiceId, ConnectedAccount[]>);

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Crear Publicación para {format(date, 'd LLLL yyyy', { locale: es })}</h2>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium mb-2 block">Tipo de Contenido</label>
                        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <button onClick={()=>setContentType('post')} className={`flex-1 py-1.5 text-sm rounded-md ${contentType === 'post' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>Post</button>
                            <button onClick={()=>setContentType('story')} className={`flex-1 py-1.5 text-sm rounded-md ${contentType === 'story' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>Story</button>
                            <button onClick={()=>setContentType('video')} className={`flex-1 py-1.5 text-sm rounded-md ${contentType === 'video' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}>Video/Reel</button>
                        </div>
                    </div>
                    <div className="relative">
                        <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Escribe tu contenido aquí, o deja una idea para que la IA la desarrolle..." className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"/>
                        <button onClick={handleGenerateText} disabled={isAiLoading || credits < 10} className="absolute bottom-2 right-2 text-xs flex items-center px-2 py-1 rounded-md bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 font-semibold hover:bg-yellow-400/30 disabled:opacity-50">
                            <WandIcon className="h-4 w-4 mr-1"/>
                            {isAiLoading ? 'Generando...' : `Generar con IA (10 créd.)`}
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <UploadCloudIcon className="h-5 w-5"/> Subir Media
                            </button>
                            {image && <img src={image} alt="Preview" className="h-16 w-16 object-cover rounded-md"/>}
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Hora:</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Publicar en:</p>
                        <div className="space-y-3">
                            {Object.entries(groupedAccounts).map(([serviceId, accounts]: [string, ConnectedAccount[]]) => {
                                const config = serviceConfig[serviceId as ServiceId];
                                return (
                                    <div key={serviceId}>
                                        <h4 className="font-semibold text-xs uppercase text-gray-500 flex items-center gap-2 mb-1">
                                            <config.icon className={`h-4 w-4 ${config.color}`} />
                                            {config.name}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {accounts.map((account: ConnectedAccount) => (
                                                <button key={account.id} onClick={() => handleAccountToggle(account.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border-2 transition-colors ${selectedAccounts.includes(account.id) ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/40' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {account.name}
                                                    {selectedAccounts.includes(account.id) && <CheckCircleIcon className="h-4 w-4 text-purple-600"/>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">Programar</button>
                </div>
            </Card>
        </div>
    );
};


const CampaignsPage: React.FC<{onNavigate: (page: Page | PublicRoute | string) => void}> = ({ onNavigate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState<Post[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    useEffect(() => {
        const storedAccounts = localStorage.getItem('nexuspro_connected_accounts');
        if (storedAccounts) {
            setConnectedAccounts(JSON.parse(storedAccounts));
        }
        const storedPosts = localStorage.getItem('scheduledPosts');
        if (storedPosts) {
            const parsedPosts = JSON.parse(storedPosts).map(p => ({...p, date: new Date(p.date)}));
            setPosts(parsedPosts);
        }
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionsRef.current && !actionsRef.current.contains(event.target)) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [actionsRef]);


    const savePosts = (newPosts: Post[]) => {
        setPosts(newPosts);
        localStorage.setItem('scheduledPosts', JSON.stringify(newPosts));
    }

    const openModal = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSavePost = (newPostData) => {
        savePosts([...posts, { ...newPostData, id: Date.now() }]);
        setIsModalOpen(false);
    };

    const postsForDay = (day: Date) => {
        return posts
            .filter(p => format(p.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    };
    
    const getAccountById = (id: string) => connectedAccounts.find(acc => acc.id === id);

    const escapeCsvValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };
    
    const handleExportCSV = () => {
        if (posts.length === 0) {
            alert("No hay publicaciones para exportar.");
            return;
        }
        const headers = ['id', 'date', 'text', 'image', 'accounts', 'contentType'];
        const csvContent = [
            headers.join(','),
            ...posts.map(post => headers.map(header => {
                let value = post[header];
                if (header === 'date' && value instanceof Date) {
                    value = value.toISOString();
                } else if (header === 'accounts' && Array.isArray(value)) {
                    value = value.join(';'); // Use semicolon to separate account IDs
                }
                return escapeCsvValue(value);
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `campaign_posts_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsActionsOpen(false);
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length < 2) throw new Error("CSV vacío o sin datos.");

                const headers = lines[0].split(',').map(h => h.trim());
                const newPosts: Post[] = lines.slice(1).map((line, index) => {
                    const values = line.split(',');
                    const postData = headers.reduce((obj, header, i) => {
                        obj[header] = values[i]?.replace(/^"|"$/g, '').trim(); // Basic de-quoting
                        return obj;
                    }, {} as any);
                    
                    return {
                        id: Date.now() + index,
                        date: postData.date ? new Date(postData.date) : new Date(),
                        text: postData.text || '',
                        image: postData.image || null,
                        accounts: postData.accounts ? postData.accounts.split(';') : [],
                        contentType: ['post', 'story', 'video'].includes(postData.contentType) ? postData.contentType : 'post',
                    };
                });
                
                savePosts([...newPosts, ...posts]);
                alert(`${newPosts.length} publicaciones importadas con éxito.`);
            } catch (error) {
                alert(`Error al importar el archivo CSV: ${error.message}`);
            } finally {
                if(fileInputRef.current) fileInputRef.current.value = "";
                setIsActionsOpen(false);
            }
        };
        reader.readAsText(file);
    };
    
    const startOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const start = add(startOfMonthDate, { days: -((startOfMonthDate.getDay() + 6) % 7) });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];


    return (
        <div className="space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleImportCSV} className="hidden" accept=".csv" />
            {isModalOpen && selectedDate && <CreatePostModal date={selectedDate} onClose={() => setIsModalOpen(false)} onSave={handleSavePost} connectedAccounts={connectedAccounts} />}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <CalendarViewIcon className="h-8 w-8 mr-3"/> Planificador de Contenido
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Planifica, programa y publica tu contenido en todas las redes sociales.</p>
                </div>
                 <div className="flex items-center gap-2">
                     <div ref={actionsRef} className="relative">
                        <button onClick={() => setIsActionsOpen(!isActionsOpen)} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Acciones
                        </button>
                        {isActionsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                <a href="#" onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <UploadCloudIcon className="h-4 w-4"/> Importar CSV
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExportCSV(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <DownloadIcon className="h-4 w-4"/> Exportar CSV
                                </a>
                            </div>
                        )}
                    </div>
                    <button onClick={() => onNavigate('settings')} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <SettingsIcon className="h-5 w-5 mr-2"/>
                        Gestionar Cuentas
                    </button>
                    <button onClick={() => openModal(new Date())} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[hsl(var(--accent-hue)_var(--accent-saturation)_var(--accent-lightness))] hover:opacity-90">
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Crear Publicación
                    </button>
                </div>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentDate(d => add(d, { months: -1 }))}>&lt;</button>
                    <h2 className="text-xl font-bold capitalize">{format(currentDate, 'LLLL yyyy', { locale: es })}</h2>
                    <button onClick={() => setCurrentDate(d => add(d, { months: 1 }))}>&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
                    {weekdays.map(day => <div key={day} className="text-center py-2 bg-gray-50 dark:bg-gray-800 text-sm font-semibold">{day}</div>)}
                    {days.map(day => (
                        <div key={day.toString()} onClick={() => openModal(day)} className={`p-2 h-36 flex flex-col bg-white dark:bg-gray-800/80 ${isSameMonth(day, currentDate) ? '' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400'} relative group hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors`}>
                            <span className={`font-semibold ${isToday(day) ? 'bg-purple-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>{format(day, 'd')}</span>
                            <div className="flex-grow overflow-y-auto text-xs mt-1 space-y-1 pr-1">
                                {postsForDay(day).map(post => {
                                     const ContentIcon = post.contentType === 'video' ? VideoIcon : post.contentType === 'story' ? StoryIcon : null;
                                     return (
                                        <div key={post.id} className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded flex items-center gap-1.5">
                                            <span className="font-bold">{format(post.date, 'HH:mm')}</span>
                                            <div className="flex items-center gap-1">
                                                {ContentIcon && <ContentIcon className="h-3 w-3" />}
                                                {post.accounts.map(accId => {
                                                    const account = getAccountById(accId);
                                                    if (!account) return null;
                                                    const { icon: Icon, color } = serviceConfig[account.serviceId as ServiceId];
                                                    return <Icon key={accId} className={`h-3 w-3 ${color}`} title={account.name} />;
                                                })}
                                            </div>
                                            <span className="truncate flex-1">{post.text}</span>
                                        </div>
                                     )
                                })}
                            </div>
                            <button className="absolute bottom-2 right-2 p-1 rounded-full bg-purple-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"><PlusIcon className="h-4 w-4"/></button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default CampaignsPage;