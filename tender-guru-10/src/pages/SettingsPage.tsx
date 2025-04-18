
import React from 'react';
import { Card } from '@/components/ui/card';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <p className="text-gray-600">System settings and preferences</p>
      </Card>
    </div>
  );
};

export default SettingsPage;
