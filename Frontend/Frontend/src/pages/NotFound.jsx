import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-black text-indigo-500">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mt-2 mb-6">The endpoint or page you requested does not exist in the route directory.</p>
      <Button onClick={() => navigate('/')}>Return to Homepage</Button>
    </div>
  );
}