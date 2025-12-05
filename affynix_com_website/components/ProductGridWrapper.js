'use client';

import { useState } from 'react';
import ProductGrid from './ProductGrid';

export default function ProductGridWrapper({ domainConfig, products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  return (
    <ProductGrid 
      domainConfig={domainConfig} 
      products={products}
      searchTerm={searchTerm}
      filterCategory={filterCategory}
      onFilterChange={setFilterCategory}
    />
  );
}
