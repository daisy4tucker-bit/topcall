import React, { useEffect } from 'react';
import { Profile } from '../../types';
import { LocationContext, LocationBreadcrumb } from '../../types/location';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  type?: 'profile' | 'location' | 'website';
  profileData?: Profile | null;
  locationData?: LocationContext | null;
  breadcrumbs?: LocationBreadcrumb[];
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath,
  type = 'website',
  profileData,
  locationData,
  breadcrumbs,
  noIndex = false,
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    // Update OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update OG & Twitter Image
    const ogImageUrl = profileData?.coverUrl || profileData?.avatarUrl || '/og-image.jpg';
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', ogImageUrl);
    let twImg = document.querySelector('meta[name="twitter:image"]');
    if (twImg) twImg.setAttribute('content', ogImageUrl);

    // Robots meta tag
    let robots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots) {
      robots.setAttribute('content', 'index, follow');
    }

    // JSON-LD Structured Data
    const existingScript = document.getElementById('aura-schema-jsonld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'aura-schema-jsonld';
    script.type = 'application/ld+json';

    let schema: any = {
      '@context': 'https://schema.org',
      '@type': type === 'profile' ? 'Person' : 'WebSite',
      name: title,
      description: description,
      url: window.location.href,
    };

    if (type === 'profile' && profileData) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profileData.displayName,
        jobTitle: 'Independent Social Companion & Event Hostess',
        address: {
          '@type': 'PostalAddress',
          addressLocality: profileData.city,
          addressRegion: profileData.state,
          addressCountry: profileData.country,
        },
        image: profileData.avatarUrl,
        description: profileData.bioSnippet,
      };
    }

    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('aura-schema-jsonld');
      if (el) el.remove();
    };
  }, [title, description, canonicalPath, type, profileData, noIndex]);

  return null;
};
