import { Html, Head, Main, NextScript } from "next/document";


// head itu awalnya ada di _app.tsx namun ada erro yang menyarakan di isi di  _dokumen
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
