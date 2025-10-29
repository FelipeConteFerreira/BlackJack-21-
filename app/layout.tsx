import './globals.css'

export const metadata = {
  title: 'Blackjack Simulator',
  description: 'Simulador de Blackjack'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="app-root">
          {children}
        </main>
      </body>
    </html>
  )
}
