import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/App'; 
import { AppContextProvider } from '@/contexts/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // This error will be visible in the browser console if #root is missing.
  console.error("Fatal Error: Could not find root element with ID 'root' in the HTML to mount the React application.");
  // Display a user-friendly message directly in the body if possible
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: sans-serif; color: red;">Xatolik: Ilova uchun asosiy element topilmadi. Iltimos, sahifani yangilang yoki administratorga murojaat qiling.</div>';
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>
);