import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'organization';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

/**
 * SEO Component with Structured Data (JSON-LD)
 * Adds comprehensive meta tags and structured data for better search engine optimization
 */
export default function SEO({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  keywords = [],
}: SEOProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // Build full URLs
  const siteUrl = siteConfig.url;
  const fullUrl = `${siteUrl}${location.pathname}`;
  const ogImage = image 
    ? (image.startsWith('http') ? image : `${siteUrl}/${image}`)
    : `${siteUrl}/img/hero.jpg`;
  
  const pageTitle = title || siteConfig.title;
  const pageDescription = description || siteConfig.tagline;

  // Default keywords
  const defaultKeywords = [
    'цифровой архив',
    'веб-архивация',
    'сохранение цифрового наследия',
    'ruarxive',
    'российский архив',
    'архивация сайтов',
    'архивация telegram',
    'warc',
    'wacz',
    'digital preservation',
    'web archiving',
    'digital archive',
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ruarxive - Национальный цифровой архив России',
    alternateName: 'Ruarxive',
    url: siteUrl,
    logo: `${siteUrl}/img/logo.svg`,
    description: 'Национальный цифровой архив России для сохранения российских и связанных с Россией цифровых ресурсов',
    foundingDate: '2022',
    sameAs: [
      'https://t.me/ruarxive',
      'https://github.com/ruarxive',
      'https://www.infoculture.ru',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Russian'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Russia',
    },
  };

  // WebSite structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ruarxive',
    url: siteUrl,
    description: pageDescription,
    publisher: {
      '@type': 'Organization',
      name: 'Ruarxive',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/logo.svg`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/kb?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Article schema (if type is article)
  const articleSchema = type === 'article' && publishedTime ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    image: ogImage,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author || 'Ruarxive Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ruarxive',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  } : null;

  return (
    <Head>
      {/* Additional Meta Tags */}
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || 'Ruarxive, Information Culture'} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Russian" />
      <meta name="geo.region" content="RU" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Ruarxive - Национальный цифровой архив России" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@ruarxive" />
      <meta name="twitter:creator" content="@ruarxive" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
    </Head>
  );
}
