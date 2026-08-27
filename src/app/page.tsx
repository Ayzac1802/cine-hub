import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminPanelClient from './components/AdminPanelClient';

export default function AdminPanelPage() {
  return (
    <AppLayout>
      <AdminPanelClient />
    </AppLayout>
  );
}