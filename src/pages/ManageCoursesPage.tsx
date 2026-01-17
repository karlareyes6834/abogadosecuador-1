import React from 'react';
import ProductsPage from './ProductsPage';
import { Page, PublicRoute } from '../types';

const ManageCoursesPage: React.FC<{onNavigate: (page: Page | PublicRoute | string) => void}> = ({ onNavigate }) => {
    // This page now acts as a specialized view of the main catalog management page.
    // It renders the ProductsPage with the initial filter set to 'course',
    // centralizing all catalog management.
    return <ProductsPage onNavigate={onNavigate} initialFilter="course" />;
};

export default ManageCoursesPage;