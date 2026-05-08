import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "D'RENTALS by Penmen Studios",
    short_name: "D'RENTALS",
    description: 'Professional cinema camera and equipment rentals in Hyderabad.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#E31B23', // Brand red
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
