import type { Metadata } from 'next'
import 'primeicons/primeicons.css'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'BIS — Budget Preparation',
  description: 'Senate of the Philippines — Budget Information System · Preparation Module',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
