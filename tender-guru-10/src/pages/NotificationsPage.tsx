
import React from 'react';
import { Card } from '@/components/ui/card';

const NotificationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <p className="text-gray-600">Your notifications will appear here</p>
      </Card>
    </div>
  );
};

export default NotificationsPage;
