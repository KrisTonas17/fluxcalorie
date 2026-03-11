import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flux — Daily Energy Estimator",
  description: "A science-based daily energy estimator. Transparent. Anonymous. No accounts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: "#0a0a0f", colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        />
      </head>
      <body style={{ background: "#0a0a0f", color: "#e8e8f0", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
