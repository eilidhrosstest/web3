import { useEffect } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from 'next-themes'

import '../styles/global.css'
import siteConfig from '../config/siteConfig.js'
import Layout from '../components/Layout'
import * as gtag from '../lib/gtag'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  // Google Analytics
  if (siteConfig.analytics) {
    useEffect(() => {
      const handleRouteChange = (url) => {
        gtag.pageview(url)
      }
      router.events.on('routeChangeComplete', handleRouteChange)
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [router.events])
  }
  // end Google Analytics
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <DefaultSeo
        titleTemplate={"%s | " + siteConfig.title}
        defaultTitle={siteConfig.title}
        description={siteConfig.description}
        {...siteConfig.nextSeo}
      />
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      {siteConfig.analytics && (
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics}`}
        />
      )}
      {siteConfig.analytics && (
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.analytics}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp