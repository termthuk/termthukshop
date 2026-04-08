import './globals.css'

export const metadata = {
  title: 'TermthukShop — Dashboard',
  description: 'ระบบจัดการร้านเติมเกมออนไลน์',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
