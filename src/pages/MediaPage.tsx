import React, { useState, useRef } from 'react';
import Card from '../components/Card';
import { PlusIcon, SearchIcon, ImageIcon, VideoIcon, FileTextIcon, MoreVerticalIcon, EditIcon, TrashIcon, CopyIcon } from '../components/icons/InterfaceIcons';

type AssetType = 'image' | 'video' | 'document';

interface Asset {
    id: number;
    name: string;
    type: AssetType;
    size: string;
    url: string;
    thumb: string;
    title: string;
    alt: string;
}

const initialAssets: Asset[] = [
    { id: 1, name: 'hero-background.jpg', type: 'image', size: '1.2 MB', url: 'https://images.unsplash.com/photo-1511300636412-01634319a72c?q=80&w=800', thumb: 'https://images.unsplash.com/photo-1511300636412-01634319a72c?q=80&w=800', title: 'Fondo de héroe', alt: 'Paisaje montañoso abstracto' },
    { id: 2, name: 'product-demo.mp4', type: 'video', size: '15.4 MB', url: '#', thumb: '', title: 'Demo de Producto', alt: '' },
    { id: 3, name: 'brochure.pdf', type: 'document', size: '850 KB', url: '#', thumb: '', title: 'Folleto Corporativo', alt: '' },
    { id: 4, name: 'logo-white.png', type: 'image', size: '56 KB', url: 'https://images.unsplash.com/photo-1611162617213-6d22e52516DE?q=80&w=800', thumb: 'https://images.unsplash.com/photo-1611162617213-6d22e52516DE?q=80&w=800', title: 'Logo Blanco', alt: 'Logo de NexusPro en blanco' },
];

const typeIcons: Record<AssetType, React.FC<any>> = {
    image: ImageIcon,
    video: VideoIcon,
    document: FileTextIcon,
};

const EditAssetModal = ({ asset, onClose, onSave }) => {
    const [title, setTitle] = useState(asset.title);
    const [alt, setAlt] = useState(asset.alt);
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Editar Metadatos</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Título</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Texto Alternativo (Alt)</label>
                        <input type="text" value={alt} onChange={e => setAlt(e.target.value)} className="mt-1 block w-full px-3 py-2 rounded-md bg-[var(--background)] border border-[var(--border)]"/>
                    </div>
                </div>
                 <div className="flex justify-end gap-3 pt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                    <button onClick={() => onSave(asset.id, { title, alt })} className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Guardar</button>
                </div>
            </Card>
        </div>
    );
};

const MediaPage: React.FC = () => {
    const [assets, setAssets] = useState(initialAssets);
    const [filter, setFilter] = useState<'all' | AssetType>('all');
    const [search, setSearch] = useState('');
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredAssets = assets.filter(asset => 
        (filter === 'all' || asset.type === filter) &&
        asset.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const newAsset: Asset = {
                id: Date.now(),
                name: file.name,
                type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
                size: `${(file.size / 1024).toFixed(1)} KB`,
                url: URL.createObjectURL(file),
                thumb: file.type.startsWith('image') ? URL.createObjectURL(file) : '',
                title: file.name,
                alt: '',
            };
            setAssets(prev => [newAsset, ...prev]);
        }
    };
    
    const handleSaveMetadata = (id, metadata) => {
        setAssets(prev => prev.map(a => a.id === id ? {...a, ...metadata} : a));
        setEditingAsset(null);
    }
    
    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copiada al portapapeles!');
    }

    const deleteAsset = (id: number) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
            setAssets(prev => prev.filter(a => a.id !== id));
        }
    }


    return (
        <div className="space-y-6">
            {editingAsset && <EditAssetModal asset={editingAsset} onClose={() => setEditingAsset(null)} onSave={handleSaveMetadata} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><ImageIcon className="h-8 w-8 mr-3"/> Biblioteca Multimedia</h1>
                    <p className="mt-1 text-[var(--muted-foreground)]">Gestiona todas tus imágenes, videos y documentos.</p>
                </div>
                <button onClick={handleUploadClick} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    Subir Archivo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>

            <Card className="!p-4">
                 <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--background)] border border-transparent focus:bg-[var(--card)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                        />
                    </div>
                     <div className="flex-shrink-0 p-1 bg-[var(--background)] rounded-lg inline-flex items-center gap-1">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>Todos</button>
                        <button onClick={() => setFilter('image')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'image' ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>Imágenes</button>
                        <button onClick={() => setFilter('video')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'video' ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>Videos</button>
                        <button onClick={() => setFilter('document')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'document' ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}>Docs</button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAssets.map(asset => {
                    const AssetIcon = typeIcons[asset.type];
                    return (
                        <Card key={asset.id} className="!p-0 group relative">
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="relative">
                                    <button onClick={(e) => { e.currentTarget.nextElementSibling?.classList.toggle('hidden'); }} className="p-1.5 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                        <MoreVerticalIcon className="h-4 w-4"/>
                                    </button>
                                     <div className="absolute right-0 mt-2 w-40 bg-[var(--card)] rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setEditingAsset(asset); e.currentTarget.parentElement?.classList.add('hidden') }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)]"><EditIcon className="h-4 w-4"/> Editar</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); copyUrl(asset.url); e.currentTarget.parentElement?.classList.add('hidden') }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--background)]"><CopyIcon className="h-4 w-4"/> Copiar URL</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); deleteAsset(asset.id); e.currentTarget.parentElement?.classList.add('hidden') }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[var(--background)]"><TrashIcon className="h-4 w-4"/> Eliminar</a>
                                    </div>
                                </div>
                            </div>
                            <div className="aspect-square w-full bg-[var(--background)] flex items-center justify-center rounded-t-xl overflow-hidden">
                                {asset.type === 'image' && asset.thumb ? <img src={asset.thumb} alt={asset.alt || asset.name} className="w-full h-full object-cover"/> : <AssetIcon className="h-12 w-12 text-gray-400" />}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-semibold truncate" title={asset.name}>{asset.name}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">{asset.size}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
};

export default MediaPage;