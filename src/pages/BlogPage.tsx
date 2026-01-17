import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { blogPosts } from '../data/blogData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const BlogPage: React.FC = () => {
    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-4xl font-bold font-serif">Blog Legal</h1>
                <p className="text-[var(--muted-foreground)] mt-2 text-lg">Análisis, noticias y perspectivas del mundo legal para mantenerte informado.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="!p-0 flex flex-col cursor-pointer group hover:shadow-xl transition-shadow">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-t-xl" />
                        <div className="p-6 flex flex-col flex-grow">
                             <p className="text-sm font-semibold text-[var(--accent-color)]">{post.category}</p>
                             <h2 className="text-xl font-bold mt-2 group-hover:text-[var(--accent-color)] transition-colors">{post.title}</h2>
                             <p className="text-sm text-[var(--muted-foreground)] mt-2 flex-grow">{post.excerpt}</p>
                             <div className="mt-4 flex justify-between items-center text-xs text-[var(--muted-foreground)]">
                                <span>{format(new Date(post.publishDate), 'd LLL, yyyy', { locale: es })}</span>
                                <span className="font-semibold text-[var(--accent-color)]">Leer Más &rarr;</span>
                            </div>
                        </div>
                    </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;