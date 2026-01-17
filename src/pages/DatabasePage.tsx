import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { DatabaseIcon, PlusIcon, CrmProductIcon, TextIcon, CheckIcon, TrashIcon, ImageIcon, EditIcon, PackageIcon, CalendarIcon, CrmIcon } from '../components/icons/InterfaceIcons';
import { Product, Service, CrmData } from '../types';

type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'relation' | 'image' | 'textarea';

interface Field {
    id: string;
    name: string;
    type: FieldType;
}

interface Collection {
    id: string;
    name: string;
    singular: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    fields: Field[];
    data: any[];
}

const DATABASE_KEY = 'nexuspro_database_collections';

const initialCollectionsData: Collection[] = [
    {
        id: 'products',
        name: 'Productos',
        singular: 'Producto',
        icon: PackageIcon,
        fields: [
            { id: 'imageUrl', name: 'Imagen', type: 'image' },
            { id: 'name', name: 'Nombre', type: 'text' },
            { id: 'description', name: 'Descripción', type: 'textarea' },
            { id: 'price', name: 'Precio', type: 'number' },
            { id: 'stock', name: 'Stock', type: 'number' },
            { id: 'category', name: 'Categoría', type: 'text' },
            { id: 'status', name: 'Estado', type: 'text' }, // Assuming 'active' | 'archived'
        ],
        data: [
            { id: 'prod_1', name: 'Curso de Marketing Digital', description: 'Aprende a fondo sobre marketing.', price: 49.99, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800', category: 'Cursos', status: 'active' },
            { id: 'prod_2', name: 'Ebook de Ventas', description: 'Guía para cerrar más ventas.', price: 19.99, stock: 500, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4582e8?q=80&w=800', category: 'Libros', status: 'active' },
        ]
    },
    {
        id: 'services',
        name: 'Servicios',
        singular: 'Servicio',
        icon: CalendarIcon,
        fields: [
            { id: 'name', name: 'Nombre', type: 'text' },
            { id: 'description', name: 'Descripción', type: 'textarea' },
            { id: 'duration', name: 'Duración (min)', type: 'number' },
            { id: 'price', name: 'Precio', type: 'number' },
            { id: 'billingType', name: 'Facturación', type: 'text' }, // 'one-time' | 'recurring'
            { id: 'status', name: 'Estado', type: 'text' }, // 'active' | 'archived'
        ],
        data: [
             { id: 'serv_1', name: 'Consulta Inicial', description: 'Primera consulta para evaluar necesidades.', duration: 30, price: 50, billingType: 'one-time', status: 'active', color: '#3b82f6', imageUrl: '' },
             { id: 'serv_2', name: 'Sesión de Seguimiento', description: 'Sesión de seguimiento para revisar progreso.', duration: 60, price: 90, billingType: 'one-time', status: 'active', color: '#22c55e', imageUrl: '' },
        ]
    },
    {
        id: 'crmData',
        name: 'Datos CRM',
        singular: 'Dato CRM',
        icon: CrmIcon,
        fields: [
            { id: 'userId', name: 'ID de Usuario', type: 'text' },
            { id: 'value', name: 'Valor', type: 'number' },
            { id: 'status', name: 'Estado', type: 'text' }, // PipelineStatus
            { id: 'tags', name: 'Etiquetas', type: 'text' }, // Stored as comma-separated string
        ],
        data: [
            { userId: 'user_1', value: 5000, status: 'new', tags: 'lead-caliente,demo-solicitada' },
        ]
    }
];

const EditItemModal = ({ item, fields, onClose, onSave }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Editar Elemento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium">{field.name}</label>
                            {field.type === 'boolean' ? (
                                <input
                                    type="checkbox"
                                    checked={!!formData[field.id]}
                                    onChange={e => handleChange(field.id, e.target.checked)}
                                    className="mt-1"
                                />
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={formData[field.id]}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    className="mt-1 w-full p-2 rounded bg-[var(--background)] border border-[var(--border)]"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">Guardar</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const DatabasePage: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [activeCollectionId, setActiveCollectionId] = useState<string>('products');
    const [editingItem, setEditingItem] = useState<any | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem(DATABASE_KEY);
        if (storedData) {
            setCollections(JSON.parse(storedData));
        } else {
            setCollections(initialCollectionsData);
            localStorage.setItem(DATABASE_KEY, JSON.stringify(initialCollectionsData));
        }
    }, []);

    const saveCollections = (newCollections: Collection[]) => {
        setCollections(newCollections);
        localStorage.setItem(DATABASE_KEY, JSON.stringify(newCollections));
    };
    
    const activeCollection = collections.find(c => c.id === activeCollectionId);

    const handleSaveItem = (updatedItem: any) => {
        const newCollections = collections.map(c => {
            if (c.id === activeCollectionId) {
                return {
                    ...c,
                    data: c.data.map(row => row.id === updatedItem.id ? updatedItem : row)
                };
            }
            return c;
        });
        saveCollections(newCollections);
        setEditingItem(null);
    };
    
    const handleDeleteRow = (rowId: any) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            const newCollections = collections.map(c => {
                if (c.id === activeCollectionId) {
                    return {...c, data: c.data.filter(row => row.id !== rowId)};
                }
                return c;
            });
            saveCollections(newCollections);
        }
    };

    const handleAddRow = () => {
        if (!activeCollection) return;

        const newRow = activeCollection.fields.reduce((acc, field) => {
            acc[field.id] = field.type === 'number' ? 0 : field.type === 'boolean' ? false : '';
            return acc;
        }, { id: Date.now() });

        const newCollections = collections.map(c => {
            if (c.id === activeCollectionId) {
                return {...c, data: [...c.data, newRow] };
            }
            return c;
        });
        saveCollections(newCollections);
    };

    const renderCellContent = (item, field: Field) => {
        const value = item[field.id];
        switch (field.type) {
            case 'boolean':
                return value ? <CheckIcon className="h-5 w-5 text-green-500" /> : <span className="text-red-500">×</span>;
            case 'number':
                return <span className="font-mono">{field.name === 'Precio' && value ? `$${Number(value).toFixed(2)}` : value}</span>;
            case 'date':
                return value ? new Date(value).toLocaleDateString() : '-';
            case 'image':
                return value ? <img src={value} alt={item.name || 'database image'} className="h-10 w-10 object-cover rounded-md bg-[var(--background)]" /> : <div className="h-10 w-10 bg-[var(--background)] rounded-md flex items-center justify-center"><ImageIcon className="h-5 w-5 text-gray-400" /></div>;
            case 'textarea':
                return <span className="text-xs text-[var(--muted-foreground)] truncate">{value}</span>
            default:
                return value;
        }
    };

    const CollectionTab = ({ collection }) => (
        <button
            onClick={() => setActiveCollectionId(collection.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeCollectionId === collection.id ? 'bg-[var(--card)] shadow-sm' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]/50'}`}
        >
            <collection.icon className="h-4 w-4 mr-2" />
            {collection.name}
        </button>
    );

  return (
    <div className="space-y-6">
      {editingItem && activeCollection && <EditItemModal item={editingItem} fields={activeCollection.fields} onClose={() => setEditingItem(null)} onSave={handleSaveItem} />}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center"><DatabaseIcon className="h-8 w-8 mr-3"/> Base de Datos</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">La fuente única de verdad para todo tu contenido.</p>
        </div>
         <button onClick={handleAddRow} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90">
            <PlusIcon className="h-5 w-5 mr-2"/>
            Añadir {activeCollection?.singular}
        </button>
      </div>

       <div className="p-1 bg-[var(--background)] rounded-lg inline-flex items-center gap-1 flex-wrap">
            {collections.map(c => <CollectionTab key={c.id} collection={c} />)}
        </div>

      <Card className="!p-0">
        <div className="overflow-x-auto">
            {activeCollection ? (
                <table className="min-w-full divide-y divide-[var(--border)]">
                    <thead className="bg-[var(--background)]">
                        <tr>
                            {activeCollection.fields.map(field => (
                                 <th key={field.id} className="px-6 py-3 text-left text-xs font-medium uppercase">{field.name}</th>
                            ))}
                             <th className="px-6 py-3 text-left text-xs font-medium uppercase">Acciones</th>
                        </tr>
                    </thead>
                     <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                        {activeCollection.data.length > 0 ? activeCollection.data.map(item => (
                            <tr key={item.id} className="group hover:bg-[var(--background)]">
                                {activeCollection.fields.map((field) => (
                                    <td key={field.id} className="px-6 py-2 whitespace-nowrap text-sm max-w-xs truncate">
                                        {renderCellContent(item, field)}
                                    </td>
                                ))}
                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                         <button onClick={() => handleDeleteRow(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                             <TrashIcon className="h-4 w-4"/>
                                         </button>
                                     </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={activeCollection.fields.length + 2} className="text-center py-10 text-[var(--muted-foreground)]">
                                    No hay {activeCollection.name.toLowerCase()} todavía. Haz click en "Añadir {activeCollection.singular}" para empezar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : <p className="p-4 text-center text-[var(--muted-foreground)]">Selecciona una colección para empezar.</p>}
        </div>
      </Card>
    </div>
  );
};

export default DatabasePage;