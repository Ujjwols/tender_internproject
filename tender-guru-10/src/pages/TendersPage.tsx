
import React from 'react';
import { Card } from '@/components/ui/card';
import TenderList from '@/components/tender/TenderList';

const TendersPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tender Management</h1>
        <TenderList />
      </Card>
    </div>
  );
};

export default TendersPage;
