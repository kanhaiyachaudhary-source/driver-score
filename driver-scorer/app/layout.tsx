import './globals.css';

export const metadata = {
  title: 'PolicyCenter — Driver Scoring',
  description: 'Submit driving license for risk assessment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
