import { Profile } from '../types';
import { Country, StateProvince, City, BreadcrumbItem } from '../types/location';

export interface SERPMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  ogImage: string;
  jsonLd: Record<string, any>;
  aiEntities: {
    primaryEntity: string;
    entityType: string;
    category: string;
    location: string;
    keywords: string[];
    faqItems: { question: string; answer: string }[];
  };
}

const BASE_URL = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
  ? window.location.origin
  : 'https://www.topcallgirls.online';

/**
 * Generate Homepage Directory Schema & SERP Data
 */
export function getHomepageSEO(): SERPMeta {
  const canonicalUrl = `${BASE_URL}/`;
  const title = 'Top Call Girls';
  const description =
    'Browse 100% ID-verified independent escorts, TS/transgender models, and female companions across top US and Canadian cities. Safe, discreet, and updated daily.';

  const faqItems = [
    {
      question: 'How are profiles verified on Top Call Girls?',
      answer:
        'All companion listings undergo mandatory government photo ID checks and biometric facial verification under 18 U.S.C. 2257 guidelines to eliminate impersonation and underage accounts.',
    },
    {
      question: 'Can I find both female and transgender / TS companions near me?',
      answer:
        'Yes. Top Call Girls offers dedicated filtering for verified female companions, transgender (TS) models, VIP luxury escorts, and independent private studios with direct contact info.',
    },
    {
      question: 'How do I contact an independent companion or model?',
      answer:
        'Each profile displays verified public inquiry channels, response times, operating hours, and booking guidelines with zero hidden middleman fees.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${canonicalUrl}#website`,
        url: canonicalUrl,
        name: 'Top Call Girls',
        description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Directory Home',
              item: canonicalUrl,
            },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'website',
    ogImage: 'https://callgirls.city/uploads/1790205590094-27427353.webp',
    jsonLd,
    aiEntities: {
      primaryEntity: 'Aura Adult Profile & Companion Directory',
      entityType: 'Directory Platform / Search Engine',
      category: 'Adult Oriented Directory, Escort Directory, TS Escorts, Call Girls',
      location: 'United States & Canada',
      keywords: [
        'verified escorts near me',
        'trans escorts near me',
        'shemale escorts',
        'call girls city directory',
        'independent companions',
        'TS models',
        'VIP luxury escorts',
      ],
      faqItems,
    },
  };
}

/**
 * Generate Location Page SEO & BreadcrumbList Schema
 */
export function getLocationPageSEO(
  country: Country,
  state: StateProvince | null,
  city: City | null,
  profilesCount: number
): SERPMeta {
  const path = city
    ? `/${country.slug}/${state?.slug}/${city.slug}/`
    : state
    ? `/${country.slug}/${state.slug}/`
    : `/${country.slug}/`;

  const canonicalUrl = `${BASE_URL}${path}`;

  const locationName = city ? `${city.name}, ${city.stateCode}` : state ? `${state.name}, ${country.name}` : country.name;

  const title = city
    ? `${city.name} Escorts, TS Models & Verified Call Girls – ${city.stateCode} Directory`
    : state
    ? `${state.name} Escorts & Companion Directory – ${country.name}`
    : `${country.name} Escorts & Verified Companions Directory`;

  const description = city
    ? `Browse ${profilesCount} verified independent female companions, transgender / TS models, and VIP escorts in ${city.name}, ${city.stateCode}. Incall studios, outcall rates, and direct contact.`
    : `Discover active verified escort listings across ${state?.name || country.name}. Filter by city, distance radius, and verified ID.`;

  const breadcrumbsList = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: country.name, item: `${BASE_URL}/${country.slug}/` },
  ];

  if (state) {
    breadcrumbsList.push({
      '@type': 'ListItem',
      position: 3,
      name: state.name,
      item: `${BASE_URL}/${country.slug}/${state.slug}/`,
    });
  }

  if (city) {
    breadcrumbsList.push({
      '@type': 'ListItem',
      position: 4,
      name: city.name,
      item: `${BASE_URL}/${country.slug}/${state?.slug}/${city.slug}/`,
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title,
        url: canonicalUrl,
        description,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbsList,
        },
      },
      {
        '@type': 'Place',
        name: locationName,
        geo: city?.lat
          ? {
              '@type': 'GeoCoordinates',
              latitude: city.lat,
              longitude: city.lng,
            }
          : undefined,
      },
    ],
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'website',
    ogImage: city?.heroImage || 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200',
    jsonLd,
    aiEntities: {
      primaryEntity: `${locationName} Companion Hub`,
      entityType: 'Geographic Directory Collection',
      category: 'Local Escort Directory, TS Companions, Incall & Outcall',
      location: locationName,
      keywords: [
        `${city?.name || state?.name} escorts`,
        `${city?.name || state?.name} trans companions`,
        `${city?.name || state?.name} shemale models`,
        `${city?.name || state?.name} call girls`,
        `verified escorts in ${city?.name || state?.name}`,
      ],
      faqItems: [],
    },
  };
}

/**
 * Generate Individual Profile Page SEO & Person / LocalBusiness Schema
 */
export function getProfilePageSEO(profile: Profile): SERPMeta {
  const canonicalUrl = `${BASE_URL}/profiles/${profile.slug}`;
  const title = `${profile.displayName}, ${profile.age} – Verified Companion in ${profile.city}, ${profile.state} | Aura`;
  const description = `${profile.displayName} (${profile.handle}) in ${profile.city}, ${profile.state}. ${profile.tagline}. Rates from ${profile.startingRate || 'Inquire'}. 100% ID Verified with authorized photo portfolio.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.displayName,
      alternateName: profile.handle,
      description: profile.bioSnippet,
      image: profile.galleryPhotos,
      url: canonicalUrl,
      knowsLanguage: profile.languages,
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.city,
        addressRegion: profile.state,
        addressCountry: profile.country,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Accompaniment Services',
        itemListElement: profile.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s,
          },
        })),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: profile.rating.toFixed(1),
        reviewCount: profile.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    },
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'profile',
    ogImage: profile.avatarUrl,
    jsonLd,
    aiEntities: {
      primaryEntity: profile.displayName,
      entityType: 'Verified Companion Profile',
      category: profile.categories.join(', '),
      location: `${profile.city}, ${profile.state}, ${profile.country}`,
      keywords: [
        `${profile.displayName} reviews`,
        `${profile.displayName} ${profile.city}`,
        `${profile.city} companion ${profile.handle}`,
        `${profile.city} verified model`,
      ],
      faqItems: [],
    },
  };
}
