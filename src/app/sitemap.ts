import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skillbridge-mocha-three.vercel.app';
  const lastModified = new Date();

  const routes = [
    '',
    '/come-funziona',
    '/scenari',
    '/prezzi',
    '/sicurezza-e-integrita',
    '/per-i-candidati',
    '/contatti',
    '/privacy',
    '/termini',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
