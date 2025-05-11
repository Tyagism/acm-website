import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"

export const metadata = {
  title: "ACM | University School of Automation and Robotics",
  description: "Association for Computing Machinery Student Chapter at USAR"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 