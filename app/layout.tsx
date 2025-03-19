// app/layout.tsx
import '../styles/globals.css';
import { ReactNode } from 'react';
import ClientThemeProvider from '../components/ClientThemeProvider';
import AppLayout from '../components/AppLayout';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>My Nav App</title>
      </head>
      <body>
        <ClientThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
