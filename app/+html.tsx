// app/+html.tsx
//
// Custom root HTML document for web builds. Expo Router's default
// template doesn't set viewport-fit=cover, which is required for
// iOS Safari to correctly handle its dynamic toolbar — without it,
// Safari's address bar resizing shifts flex:1 containers, causing
// the bottom tab bar to intermittently disappear/reappear.
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
`;
