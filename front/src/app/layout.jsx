import Header from '@/components/header/Header';
import './globals.css';
import Footer from '@/components/footer/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>Big 5 성격 테스트</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}