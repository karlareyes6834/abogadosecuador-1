export const digitalProducts = [
  {
    id: 'ebook-derecho-civil',
    name: 'Guía Completa de Derecho Civil',
    description: 'Manual completo sobre derecho civil ecuatoriano con casos prácticos.',
    price: 25,
    category: 'Ebooks',
    type: 'digital',
    downloadUrl: '/downloads/ebook-derecho-civil.pdf',
    imageUrl: '/images/products/ebook-civil.jpg',
    featured: true,
    tags: ['derecho civil', 'contratos', 'ecuador'],
    author: 'Dr. Wilson Ipiales'
  },
  {
    id: 'ebook-derecho-penal',
    name: 'Manual de Derecho Penal',
    description: 'Guía práctica sobre derecho penal y procedimientos judiciales.',
    price: 30,
    category: 'Ebooks',
    type: 'digital',
    downloadUrl: '/downloads/ebook-derecho-penal.pdf',
    imageUrl: '/images/products/ebook-penal.jpg',
    featured: true,
    tags: ['derecho penal', 'delitos', 'ecuador'],
    author: 'Dr. Wilson Ipiales'
  }
];

export const allProducts = [...digitalProducts];

export const getProductById = (id: string) => {
  return allProducts.find(product => product.id === id);
};
