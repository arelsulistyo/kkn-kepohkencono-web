import { MetadataRoute } from 'next'

const SECTIONS = ['tentang', 'dukuh', 'budaya', 'data', 'galeri', 'kontak']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desakepohkencono.com'
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/visualisasi-data`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...SECTIONS.map((section) => ({
      url: `${baseUrl}/#${section}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
