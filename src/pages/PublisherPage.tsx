import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { EditIcon, PlusIcon, ChevronLeftIcon, SaveIcon, WandIcon, ImageIcon, CheckIcon, TrashIcon, FacebookIcon, YoutubeIcon, TikTokIcon, BrainIcon, DownloadIcon, UploadCloudIcon } from '../components/icons/InterfaceIcons';
import { useCredits } from '../context/CreditContext';
import { generateBlogPost, generateSeoMetadata, generateBulkBlogPosts } from '../services/geminiService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface Post {
  id: number;
  title: string;
  content: string; // Markdown content
  status: 'draft' | 'published';
  seoTitle: string;
  metaDescription: string;
  featuredImage: string | null;
  publishDate: Date;
}

const POSTS_STORAGE_KEY = 'nexuspro_blog_posts';

const initialPosts: Post[] = [
  { id: 1, title: 'La Inteligencia Artificial y el Futuro del Derecho en Ecuador', content: '## Introducción\nLa IA está transformando la práctica legal...', status: 'published', seoTitle: 'IA y Futuro del Derecho en Ecuador | Abg. Ipiales', metaDescription: 'Descubre cómo la IA está transformando la práctica legal, desde la automatización de documentos hasta el análisis predictivo de sentencias.', featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', publishDate: new Date('2024-07-15') },
  { id: 2, title: 'Nuevas Reformas al Código de Trabajo: Lo que Debes Saber', content: 'Un resumen claro y conciso de las últimas modificaciones...', status: 'draft', seoTitle: '', metaDescription: '', featuredImage: null, publishDate: new Date() },
];

const BlogEditor: React.FC<{ post: Partial<Post>; onSave: (post: Post) => void; onBack: () => void; }> = ({ post, onSave, onBack }) => {
    const [editedPost, setEditedPost] = useState<Partial<Post>>(post);
    const [isSeoLoading, setIsSeoLoading] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const { credits, deductCredits } = useCredits();

    const handleSave = () => {
        onSave(editedPost as Post);
    };

    const handleGenerateContent = async () => {
        if (!editedPost.title || credits < 25) return;
        setIsContentLoading(true);
        if(deductCredits(25)) {
            const result = await generateBlogPost(editedPost.title);
            setEditedPost(prev => ({ ...prev, content: result }));
        }
        setIsContentLoading(false);
    }
    
    const handleGenerateSeo = async () => {
        if (!editedPost.content || credits < 10) return;
        setIsSeoLoading(true);
        if(deductCredits(10)) {
            const result = await generateSeoMetadata(editedPost.content);
            if (result) {
                 setEditedPost(prev => ({ ...prev, seoTitle: result.seoTitle, metaDescription: result.metaDescription }));
            } else {
                alert('La IA no pudo generar los metadatos SEO. Por favor, inténtalo de nuevo.');
            }
        }
        setIsSeoLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="flex-grow space-y-4">
                <input
                    type="text"
                    placeholder="Título del Artículo..."
                    value={editedPost.title || ''}
                    onChange={e => setEditedPost(prev => ({...prev, title: e.target.value}))}
                    className="w-full text-3xl font-bold p-2 bg-transparent focus:outline-none focus:bg-[var(--background)] rounded-lg font-serif"
                />
                <div className="relative">
                    <button onClick={handleGenerateContent} disabled={isContentLoading || !editedPost.title || credits < 25} className="absolute top-2 right-2 z-10 text-xs flex items-center px-2 py-1 rounded-md bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 font-semibold hover:bg-yellow-400/30 disabled:opacity-50">
                        <WandIcon className="h-4 w-4 mr-1"/>
                        {isContentLoading ? 'Generando...' : `Generar con IA (25 créd.)`}
                    </button>
                    <textarea
                        placeholder="Empieza a escribir tu artículo aquí (soporta Markdown)..."
                        value={editedPost.content || ''}
                        onChange={e => setEditedPost(prev => ({...prev, content: e.target.value}))}
                        className="w-full h-[calc(100vh-350px)] p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                </div>
            </div>
            <aside className="w-full md:w-80 flex-shrink-0 space-y-4">
                <Card>
                    <h3 className="font-semibold mb-2">Publicación</h3>
                    <select value={editedPost.status || 'draft'} onChange={e => setEditedPost(prev => ({...prev, status: e.target.value as any}))} className="w-full p-2 text-sm rounded-md bg-[var(--background)] border border-[var(--border)]">
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                    </select>
                    <div className="mt-4 flex gap-2">
                        <button onClick={onBack} className="w-full px-3 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Volver</button>
                        <button onClick={handleSave} className="w-full flex items-center justify-center px-3 py-2 text-sm rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90"><SaveIcon className="h-4 w-4 mr-2"/> Guardar</button>
                    </div>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-2">Imagen Destacada</h3>
                    <div className="w-full aspect-video bg-[var(--background)] rounded-md flex items-center justify-center mb-2">
                        {editedPost.featuredImage ? <img src={editedPost.featuredImage} alt="Featured" className="w-full h-full object-cover rounded-md"/> : <ImageIcon className="h-8 w-8 text-gray-400"/>}
                    </div>
                    <input type="text" placeholder="URL de la imagen..." value={editedPost.featuredImage || ''} onChange={e => setEditedPost(prev => ({...prev, featuredImage: e.target.value}))} className="w-full p-2 text-xs rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-2">SEO</h3>
                    <button onClick={handleGenerateSeo} disabled={isSeoLoading || !editedPost.content || credits < 10} className="w-full text-xs flex items-center justify-center px-2 py-1 mb-3 rounded-md bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 font-semibold hover:bg-yellow-400/30 disabled:opacity-50">
                        <WandIcon className="h-4 w-4 mr-1"/>
                        {isSeoLoading ? 'Generando...' : `Autocompletar con IA (10 créd.)`}
                    </button>
                    <input type="text" placeholder="Título SEO" value={editedPost.seoTitle || ''} onChange={e => setEditedPost(prev => ({...prev, seoTitle: e.target.value}))} className="w-full p-2 text-sm rounded-md bg-[var(--background)] border border-[var(--border)] mb-2"/>
                    <textarea placeholder="Meta Descripción" value={editedPost.metaDescription || ''} onChange={e => setEditedPost(prev => ({...prev, metaDescription: e.target.value}))} rows={3} className="w-full p-2 text-sm rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                </Card>
                <Card>
                    <h3 className="font-semibold mb-2">Compartir</h3>
                    <div className="flex justify-around">
                        <button className="p-2 rounded-full hover:bg-[var(--background)]"><FacebookIcon className="h-6 w-6 text-blue-600"/></button>
                        <button className="p-2 rounded-full hover:bg-[var(--background)]"><TikTokIcon className="h-6 w-6"/></button>
                        <button className="p-2 rounded-full hover:bg-[var(--background)]"><YoutubeIcon className="h-6 w-6 text-red-500"/></button>
                    </div>
                </Card>
            </aside>
        </div>
    );
};

const BulkGenerateModal: React.FC<{
    onClose: () => void;
    onSave: (newPosts: Post[]) => void;
}> = ({ onClose, onSave }) => {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { credits, deductCredits, addCredits } = useCredits();

    const cost = count * 25;
    const canGenerate = credits >= cost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !canGenerate) return;
        
        setIsLoading(true);
        setError('');
        
        if (deductCredits(cost)) {
            try {
                const results = await generateBulkBlogPosts(topic, count);
                if (results) {
                    const newPosts: Post[] = results.map((p, index) => ({
                        id: Date.now() + index,
                        title: p.title,
                        content: p.content,
                        status: 'draft',
                        seoTitle: p.seoTitle,
                        metaDescription: p.metaDescription,
                        featuredImage: null,
                        publishDate: new Date(),
                    }));
                    onSave(newPosts);
                    onClose();
                } else {
                    setError('No se pudieron generar los artículos.');
                }
            } catch (err) {
                setError(err.message || 'Ocurrió un error inesperado.');
                 // Refund credits on failure
                addCredits(cost);
            }
        } else {
            setError('Créditos insuficientes.');
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center"><BrainIcon className="h-6 w-6 mr-2 text-[var(--accent-color)]"/> Generación Masiva de Artículos</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Tema Principal</label>
                        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej: Implicaciones legales de la IA en Ecuador" required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Número de Artículos (1-10)</label>
                        <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(10, Number(e.target.value))))} min="1" max="10" required className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"/>
                    </div>
                     <div className="p-3 text-center bg-[var(--accent-color)]/10 border-[var(--accent-color)]/20 border rounded-lg">
                        <p className="text-sm">Coste total: <span className="font-bold text-[var(--accent-color)]">{cost} créditos</span></p>
                        <p className="text-xs text-[var(--muted-foreground)]">Saldo actual: {credits.toLocaleString()} créditos</p>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" disabled={isLoading || !canGenerate} className="px-4 py-2 text-sm rounded text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center min-w-[120px] justify-center">
                            {isLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : `Generar Artículos`}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const PublisherPage: React.FC = () => {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPost, setCurrentPost] = useState<Partial<Post> | null>(null);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        try {
            if (savedPosts) {
                 setPosts(JSON.parse(savedPosts).map(p => ({...p, publishDate: new Date(p.publishDate)})));
            } else {
                setPosts(initialPosts);
            }
        } catch (error) {
            console.error("Failed to parse posts from localStorage", error);
            setPosts(initialPosts);
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
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
    };

    const handleNewPost = () => {
        setCurrentPost({
            id: Date.now(),
            title: '',
            content: '',
            status: 'draft',
            publishDate: new Date(),
        });
        setView('editor');
    };

    const handleEditPost = (post: Post) => {
        setCurrentPost(post);
        setView('editor');
    };
    
    const handleDeletePost = (id: number) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
            savePosts(posts.filter(p => p.id !== id));
        }
    };

    const handleSavePost = (postToSave: Post) => {
        const exists = posts.some(p => p.id === postToSave.id);
        if (exists) {
            savePosts(posts.map(p => p.id === postToSave.id ? postToSave : p));
        } else {
            savePosts([postToSave, ...posts]);
        }
        setView('list');
    };
    
    const handleBulkSave = (newPosts: Post[]) => {
        savePosts([...newPosts, ...posts]);
    };

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
            alert("No hay artículos para exportar.");
            return;
        }
        const headers = ['id', 'title', 'content', 'status', 'seoTitle', 'metaDescription', 'featuredImage', 'publishDate'];
        const csvContent = [
            headers.join(','),
            ...posts.map(post => headers.map(header => {
                let value = post[header];
                if (header === 'publishDate' && value instanceof Date) {
                    value = value.toISOString();
                }
                return escapeCsvValue(value);
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `blog_posts_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                        obj[header] = values[i]?.replace(/"/g, '').trim();
                        return obj;
                    }, {} as any);

                    return {
                        id: Date.now() + index,
                        title: postData.title || 'Sin Título',
                        content: postData.content || '',
                        status: ['draft', 'published'].includes(postData.status) ? postData.status : 'draft',
                        seoTitle: postData.seoTitle || '',
                        metaDescription: postData.metaDescription || '',
                        featuredImage: postData.featuredImage || null,
                        publishDate: postData.publishDate ? new Date(postData.publishDate) : new Date(),
                    };
                });
                
                savePosts([...newPosts, ...posts]);
                alert(`${newPosts.length} artículos importados con éxito.`);
            } catch (error) {
                alert(`Error al importar el archivo CSV: ${error.message}`);
                console.error(error);
            } finally {
                if(fileInputRef.current) fileInputRef.current.value = "";
                 setIsActionsOpen(false);
            }
        };
        reader.readAsText(file);
    };

    if (view === 'editor' && currentPost) {
        return <BlogEditor post={currentPost} onSave={handleSavePost} onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleImportCSV} className="hidden" accept=".csv" />
            {isBulkModalOpen && <BulkGenerateModal onClose={() => setIsBulkModalOpen(false)} onSave={handleBulkSave} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <EditIcon className="h-8 w-8 mr-3"/> Gestor del Blog Legal
                    </h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Crea, edita y publica el contenido para atraer clientes.</p>
                </div>
                <div className="flex items-center gap-2">
                     <div ref={actionsRef} className="relative">
                        <button onClick={() => setIsActionsOpen(!isActionsOpen)} className="inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md shadow-sm bg-[var(--card)] hover:bg-[var(--background)]">
                            Acciones
                        </button>
                        {isActionsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                <a href="#" onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)]">
                                    <UploadCloudIcon className="h-4 w-4"/> Importar CSV
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleExportCSV(); }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)]">
                                    <DownloadIcon className="h-4 w-4"/> Exportar CSV
                                </a>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsBulkModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-[var(--accent-color)]/20 text-sm font-medium rounded-md shadow-sm text-[var(--accent-color)] bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20">
                        <BrainIcon className="h-5 w-5 mr-2"/>
                        Generación Masiva
                    </button>
                    <button onClick={handleNewPost} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Nuevo Artículo
                    </button>
                </div>
            </div>
            <Card className="!p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
                            </tr>
                        </thead>
                         <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {post.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">{format(post.publishDate, 'd LLL yyyy', { locale: es })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditPost(post)} className="text-[var(--accent-color)] hover:opacity-80">Editar</button>
                                        <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PublisherPage;