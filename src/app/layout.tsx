import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCALE — Content Operations CRM",
  description: "Escala tu marca personal con operaciones de contenido estratégicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@200,300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
