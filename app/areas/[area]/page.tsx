import { getPopularEquipmentForArea, getCategories } from "@/lib/data"
import EquipmentGrid from "@/components/equipment-grid"
import { Suspense } from "react"
import { EquipmentSkeleton } from "@/components/skeletons"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Phone, Mail, Camera } from "lucide-react"
import { siteConfig } from "@/config/site"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Import the area description generator
import { generateAreaDescription } from "@/lib/meta-description"
import { FAQSchema } from "@/components/structured-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define valid areas
const validAreas = [
  "hyderabad",
  "kukatpally",
  "dilsukhnagar",
  "yousufguda",
  "hitech-city",
  "gachibowli",
  "banjara-hills",
  "jubilee-hills",
  "ameerpet",
  "secunderabad",
  "madhapur",
  "begumpet",
]

// Area-specific metadata
const areaMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  hyderabad: {
    title: "Camera Rental in Hyderabad | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras, DSLRs, 4K cameras, and accessories with delivery across Hyderabad. Top-quality equipment for filmmakers and production companies.",
    keywords: [
      "camera rental hyderabad",
      "dslr rental hyderabad",
      "4k camera rental hyderabad",
      "cinema equipment hyderabad",
      "camera delivery hyderabad",
      "film equipment hyderabad",
      "video production hyderabad",
      "camera gear hyderabad",
    ],
  },
  kukatpally: {
    title: "Camera Rental in Kukatpally | Equipment Delivery Service",
    description:
      "Professional camera equipment rental with delivery in Kukatpally, Hyderabad. DSLR, 4K cameras, lenses, and accessories for your production needs.",
    keywords: [
      "camera rental kukatpally",
      "dslr rental kukatpally",
      "camera equipment kukatpally",
      "film equipment kukatpally",
      "camera delivery kukatpally",
      "video camera rental kukatpally",
      "lens rental kukatpally",
    ],
  },
  dilsukhnagar: {
    title: "Camera Rental in Dilsukhnagar | Professional Equipment Delivery",
    description:
      "Rent cinema cameras, DSLRs, and accessories with delivery in Dilsukhnagar. Quality equipment for filmmakers and photographers in Hyderabad.",
    keywords: [
      "camera rental dilsukhnagar",
      "dslr rental dilsukhnagar",
      "camera equipment dilsukhnagar",
      "film gear dilsukhnagar",
      "camera delivery dilsukhnagar",
      "video camera rental dilsukhnagar",
      "gimbal rental dilsukhnagar",
    ],
  },
  yousufguda: {
    title: "Camera Rental in Yousufguda | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Yousufguda, Hyderabad. High-quality cameras and accessories for your production.",
    keywords: [
      "camera rental yousufguda",
      "dslr rental yousufguda",
      "camera equipment yousufguda",
      "film gear yousufguda",
      "camera delivery yousufguda",
      "cinema camera rental yousufguda",
      "lens rental yousufguda",
    ],
  },
  "hitech-city": {
    title: "Camera Rental in Hitech City | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Hitech City. Premium gear for corporate videos and productions.",
    keywords: [
      "camera rental hitech city",
      "dslr rental hitech city",
      "camera equipment hitech city",
      "film gear hitech city",
      "camera delivery hitech city",
      "corporate video equipment hitech city",
      "4k camera rental hitech city",
    ],
  },
  gachibowli: {
    title: "Camera Rental in Gachibowli | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Gachibowli. High-end cameras and accessories for filmmakers and content creators.",
    keywords: [
      "camera rental gachibowli",
      "dslr rental gachibowli",
      "camera equipment gachibowli",
      "film gear gachibowli",
      "camera delivery gachibowli",
      "cinema camera rental gachibowli",
      "gimbal rental gachibowli",
    ],
  },
  "banjara-hills": {
    title: "Camera Rental in Banjara Hills | Premium Equipment Delivery",
    description:
      "Premium camera equipment rental with delivery in Banjara Hills. Professional cinema cameras and accessories for high-end productions.",
    keywords: [
      "camera rental banjara hills",
      "dslr rental banjara hills",
      "camera equipment banjara hills",
      "film gear banjara hills",
      "camera delivery banjara hills",
      "red camera rental banjara hills",
      "arri camera rental banjara hills",
    ],
  },
  "jubilee-hills": {
    title: "Camera Rental in Jubilee Hills | Premium Equipment Delivery",
    description:
      "Rent premium cinema cameras and equipment with delivery in Jubilee Hills. Professional gear for film productions and commercial shoots.",
    keywords: [
      "camera rental jubilee hills",
      "dslr rental jubilee hills",
      "camera equipment jubilee hills",
      "film gear jubilee hills",
      "camera delivery jubilee hills",
      "cinema camera rental jubilee hills",
      "professional lens rental jubilee hills",
    ],
  },
  ameerpet: {
    title: "Camera Rental in Ameerpet | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery to Ameerpet. Quality cameras and accessories for filmmakers and photographers.",
    keywords: [
      "camera rental ameerpet",
      "dslr rental ameerpet",
      "camera equipment ameerpet",
      "film gear ameerpet",
      "camera delivery ameerpet",
      "video camera rental ameerpet",
      "photography equipment ameerpet",
    ],
  },
  secunderabad: {
    title: "Camera Rental in Secunderabad | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Secunderabad. Quality gear for all your production needs.",
    keywords: [
      "camera rental secunderabad",
      "dslr rental secunderabad",
      "camera equipment secunderabad",
      "film gear secunderabad",
      "camera delivery secunderabad",
      "video production equipment secunderabad",
      "lens rental secunderabad",
    ],
  },
  madhapur: {
    title: "Camera Rental in Madhapur | Professional Equipment Delivery",
    description:
      "Professional camera equipment rental with delivery in Madhapur. High-quality cameras and accessories for corporate and creative productions.",
    keywords: [
      "camera rental madhapur",
      "dslr rental madhapur",
      "camera equipment madhapur",
      "film gear madhapur",
      "camera delivery madhapur",
      "4k camera rental madhapur",
      "corporate video equipment madhapur",
    ],
  },
  begumpet: {
    title: "Camera Rental in Begumpet | Professional Equipment Delivery",
    description:
      "Rent professional cinema cameras and equipment with delivery in Begumpet. Quality gear for filmmakers and content creators.",
    keywords: [
      "camera rental begumpet",
      "dslr rental begumpet",
      "camera equipment begumpet",
      "film gear begumpet",
      "camera delivery begumpet",
      "video camera rental begumpet",
      "photography equipment begumpet",
    ],
  },
}

// Area-specific content
const areaContent: Record<
  string,
  {
    headline: string
    subheadline: string
    description: string[]
    popularCategories: string[]
    faqs: { question: string; answer: string }[]
  }
> = {
  hyderabad: {
    headline: "CAMERA RENTAL IN HYDERABAD",
    subheadline: "Professional Cinema Equipment Delivered City-Wide",
    description: [
      "D'RENTALS is Hyderabad's premier destination for professional camera equipment. From Tollywood film sets to independent commercial shoots, we provide the reliable gear that the city's creators trust.",
      "Our central hub is fully equipped with industry-standard cameras from RED, ARRI, Sony, and Canon. We understand the fast-paced nature of production in Hyderabad, which is why our equipment is meticulously maintained and ready for action.",
      "Skip the traffic—we offer rapid, same-day delivery across the entire Hyderabad metropolitan area. Whether you're shooting at Ramoji Film City or a local studio, our team ensures your gear arrives safely and on time."
    ],
    popularCategories: ["Cinema Cameras", "Professional Lenses", "Lighting Equipment", "Audio Equipment", "Gimbals"],
    faqs: [
      {
        question: "How quickly can you deliver equipment in Hyderabad?",
        answer: "We offer same-day delivery for most areas in Hyderabad if booked before 2 PM. For urgent shoots, express delivery options are available depending on traffic conditions."
      },
      {
        question: "Do you supply gear for large film sets in Hyderabad?",
        answer: "Yes! We regularly supply A-cam and B-cam packages, along with full lighting grids, to major production houses operating in Hyderabad and Ramoji Film City."
      },
      {
        question: "Can I inspect the equipment before renting?",
        answer: "Absolutely. You can schedule an appointment to visit our central facility in Yousufguda to test the cameras, lenses, and rigs prior to your shoot."
      }
    ]
  },
  kukatpally: {
    headline: "KUKATPALLY CAMERA RENTALS",
    subheadline: "Fast Gear Delivery via the Metro Corridor",
    description: [
      "Shooting in or around Kukatpally? D'RENTALS provides rapid equipment delivery straight to your set or office, leveraging the fast connectivity of the KPHB metro corridor.",
      "We serve numerous wedding photographers, event teams, and local content creators based in Kukatpally. Our customized rental packages are designed to suit the diverse range of events hosted in this bustling residential and commercial hub.",
      "Don't waste hours traveling across the city to pick up gear. Book your DSLRs, drones, or lighting kits online, and let our logistics team handle the heavy lifting direct to your Kukatpally address."
    ],
    popularCategories: ["Event DSLRs", "Mirrorless Cameras", "Drone Rentals", "Flash & Strobe Kits", "Audio Recording"],
    faqs: [
      {
        question: "Is there a delivery fee for Kukatpally?",
        answer: "Delivery to Kukatpally is calculated based on distance from our Yousufguda hub. We offer discounted delivery rates for multi-day rentals."
      },
      {
        question: "What gear is best for indoor events in Kukatpally?",
        answer: "For indoor events in local banquet halls, we highly recommend our Sony A7S III or Canon R5 kits paired with fast f/2.8 zoom lenses for excellent low-light performance."
      }
    ]
  },
  dilsukhnagar: {
    headline: "DILSUKHNAGAR CAMERA HIRE",
    subheadline: "Premium Photo & Video Gear for East Hyderabad",
    description: [
      "D'RENTALS bridges the gap for creators in East Hyderabad by offering direct camera equipment delivery to Dilsukhnagar. We bring professional-grade gear right to your neighborhood.",
      "Whether you're covering a large traditional wedding, shooting a short film, or capturing street photography, we have the right tools. Our inventory includes the latest mirrorless systems and robust lighting setups.",
      "Our team is experienced in navigating Dilsukhnagar's busy streets to ensure your rental gear arrives exactly when you need it, complete with a quick setup overview if requested."
    ],
    popularCategories: ["Wedding Photography Kits", "Video Cameras", "Prime Lenses", "Continuous Lighting", "Stabilizers"],
    faqs: [
      {
        question: "Can I rent equipment for a single day in Dilsukhnagar?",
        answer: "Yes, we offer flexible 24-hour rentals. You can receive the equipment in the evening for a shoot the following day."
      },
      {
        question: "Do you rent out heavy-duty tripods and jibs?",
        answer: "Yes, we stock professional fluid-head tripods, jibs, and heavy-duty light stands perfect for stable video production."
      }
    ]
  },
  yousufguda: {
    headline: "YOUSUFGUDA CAMERA HQ",
    subheadline: "Our Central Hub for Instant Pickups & Rentals",
    description: [
      "Yousufguda is the home of D'RENTALS. Being in our neighborhood means you get the absolute fastest access to our entire inventory of cinema cameras, lenses, and production gear.",
      "Local creators, film students, and production teams frequently utilize our Yousufguda hub for rapid equipment checkouts. Enjoy the convenience of dropping by to test lenses or build your custom camera rig.",
      "Because you're local, we can often accommodate last-minute rental requests and rapid gear swaps. Experience the ultimate convenience of having a premium rental house right in your backyard."
    ],
    popularCategories: ["Cinema Cameras", "Lens Testing Kits", "Heavy Duty Grip", "Audio Mixers", "Director's Monitors"],
    faqs: [
      {
        question: "Can I just walk in to rent gear in Yousufguda?",
        answer: "While we recommend booking online to guarantee availability, walk-ins at our Yousufguda location are always welcome for last-minute needs."
      },
      {
        question: "Do you offer parking while I load the equipment?",
        answer: "Yes, we have a dedicated loading zone at our Yousufguda office so you can safely transfer heavy equipment cases into your vehicle."
      }
    ]
  },
  "hitech-city": {
    headline: "HITECH CITY CORPORATE RENTALS",
    subheadline: "High-End Gear for Tech Parks and Corporate Shoots",
    description: [
      "D'RENTALS is the trusted equipment partner for corporate video productions across Hitech City. We understand the strict schedules and professional standards required when shooting in IT parks and corporate headquarters.",
      "We deliver high-resolution 4K cameras, teleprompters, and professional interview lighting kits directly to your office. Perfect for CEO interviews, product launches, or internal training videos.",
      "Our team handles the logistics so your corporate communications team can focus on the message. We provide discreet, professional delivery to all major tech parks in the Hitech City area."
    ],
    popularCategories: ["Teleprompters", "Interview Lighting", "4K Video Cameras", "Wireless Lavaliere Mics", "Corporate Streaming Kits"],
    faqs: [
      {
        question: "Can you provide equipment for live streaming a corporate town hall?",
        answer: "Absolutely. We rent out multi-camera streaming kits, video switchers, and clean audio feeds perfect for corporate live streams in Hitech City."
      },
      {
        question: "Do you offer GST invoices for corporate accounting?",
        answer: "Yes, we provide fully compliant B2B GST invoices for all corporate rentals to facilitate your company's accounting processes."
      }
    ]
  },
  gachibowli: {
    headline: "GACHIBOWLI PRODUCTION GEAR",
    subheadline: "Equipping Tech Events and Creative Agencies",
    description: [
      "Serving the vibrant tech and university sectors in Gachibowli, D'RENTALS delivers top-tier camera and audio equipment directly to your event space, campus, or studio.",
      "Whether you're covering a massive convention at a local hotel, shooting a commercial for a creative agency, or working on a university film project, we have specialized packages to match your scale.",
      "We offer flexible pickup and delivery windows to accommodate the often unpredictable schedules of major events and conferences hosted in Gachibowli."
    ],
    popularCategories: ["Event Video Kits", "Drone Rentals", "Podcast Audio Gear", "Mirrorless Systems", "LED Panel Lights"],
    faqs: [
      {
        question: "Do you rent out podcasting or panel discussion audio gear?",
        answer: "Yes, we have multi-channel recorders and broadcast-quality microphones perfect for panel discussions and podcasts often hosted in Gachibowli workspaces."
      },
      {
        question: "How do you handle delivery to large corporate campuses?",
        answer: "We coordinate with your on-site contact to ensure smooth security clearance and deliver directly to your specific building or loading dock."
      }
    ]
  },
  "banjara-hills": {
    headline: "BANJARA HILLS CINEMA RENTALS",
    subheadline: "Premium Gear for High-End Productions",
    description: [
      "D'RENTALS caters to the high-end production houses, advertising agencies, and luxury event planners based in Banjara Hills. We provide the industry's most sought-after cinema equipment.",
      "Our premium inventory includes the latest from RED Digital Cinema and ARRI, paired with world-class prime cinema lenses. We ensure every piece of gear meets the exacting standards of commercial filmmaking.",
      "Enjoy white-glove delivery service directly to your studio or shooting location in Banjara Hills. Our equipment arrives fully prepped, clean, and ready to roll the moment it hits the set."
    ],
    popularCategories: ["RED & ARRI Cameras", "Cinema Primes", "High-End Lighting", "Wireless Video Transmitters", "Follow Focus Systems"],
    faqs: [
      {
        question: "Do you require insurance for renting cinema cameras in Banjara Hills?",
        answer: "For our highest-tier cinema cameras (RED/ARRI), we strongly recommend production insurance. We can guide you through the coverage requirements during booking."
      },
      {
        question: "Can I rent a DIT station along with the cameras?",
        answer: "Yes, we offer media management tools, high-speed card readers, and color-accurate director's monitors for your on-set DIT needs."
      }
    ]
  },
  "jubilee-hills": {
    headline: "JUBILEE HILLS FILM EQUIPMENT",
    subheadline: "The Filmmaker's Choice for Premium Rentals",
    description: [
      "Located near the heart of the Telugu film industry, D'RENTALS provides Jubilee Hills with unparalleled access to top-tier filmmaking equipment. We are the preferred rental house for directors and DPs.",
      "From independent short films to major commercial features, our gear is trusted on sets throughout Jubilee Hills. We offer comprehensive packages that include cameras, specialized grip gear, and advanced lighting solutions.",
      "We understand the demands of the industry. That's why we offer 24/7 support and rapid replacement services to ensure your production in Jubilee Hills never faces unnecessary downtime."
    ],
    popularCategories: ["Cinema Cameras", "Anamorphic Lenses", "Heavy Duty Grip", "Large Source Lighting", "Production Monitors"],
    faqs: [
      {
        question: "Do you offer multi-week rental discounts for feature films?",
        answer: "Yes, we offer highly competitive long-term rental rates for feature films and web series shooting in Jubilee Hills. Contact us for a custom quote."
      },
      {
        question: "Can your team assist with building complex camera rigs?",
        answer: "Our technicians are experts at configuring complex cinema rigs and can prep the camera exactly to your DP's specifications before delivery."
      }
    ]
  },
  ameerpet: {
    headline: "AMEERPET CAMERA RENTALS",
    subheadline: "Affordable Gear for Students and Creators",
    description: [
      "Ameerpet is a hub for education and training, and D'RENTALS is here to support the next generation of creators. We offer budget-friendly, high-quality camera rentals perfect for students and beginners.",
      "Whether you are enrolled in a local multimedia institute or shooting your first indie project, we provide accessible gear like Canon and Sony mirrorless cameras, basic lighting kits, and clear audio recorders.",
      "We believe professional gear shouldn't be out of reach. We offer flexible daily rates and are always happy to provide quick tips and guidance to help you get the most out of your rental."
    ],
    popularCategories: ["Beginner DSLRs", "Vlogging Kits", "Basic Lighting", "Shotgun Mics", "Affordable Lenses"],
    faqs: [
      {
        question: "Are your cameras beginner-friendly?",
        answer: "Absolutely! We have a range of intuitive mirrorless cameras and DSLRs that are perfect for learning the ropes of photography and videography."
      },
      {
        question: "Do you offer student discounts in Ameerpet?",
        answer: "We occasionally run promotions for students of recognized multimedia and film institutes. Reach out to our team with your student ID to see current offers."
      }
    ]
  },
  secunderabad: {
    headline: "SECUNDERABAD CAMERA RENTALS",
    subheadline: "Reliable Gear Delivery Across the Twin City",
    description: [
      "D'RENTALS seamlessly bridges the twin cities by offering dedicated equipment delivery services to Secunderabad. We bring the best of Hyderabad's rental inventory directly to you.",
      "From capturing heritage walks to covering large-scale events at local venues, our gear is versatile and reliable. We stock everything from versatile zoom lenses for event photography to robust gimbals for smooth video.",
      "Avoid the cross-city traffic. Schedule your rental online, and our logistics team will ensure your equipment arrives safely at your Secunderabad location, ready for your shoot."
    ],
    popularCategories: ["Event Photography Kits", "Versatile Zoom Lenses", "Gimbals", "Speedlights", "Audio Recorders"],
    faqs: [
      {
        question: "How far in advance should I book for a Secunderabad delivery?",
        answer: "To ensure timely delivery across the city, we recommend booking at least 24-48 hours in advance for Secunderabad locations."
      },
      {
        question: "Can I rent specialized lenses for sports or wildlife photography?",
        answer: "Yes, we stock super-telephoto lenses perfect for capturing sports events or wildlife, which are popular rentals for weekend trips starting from Secunderabad."
      }
    ]
  },
  madhapur: {
    headline: "MADHAPUR MEDIA EQUIPMENT",
    subheadline: "Powering Ad Agencies and Corporate Media",
    description: [
      "Madhapur is home to some of the city's most dynamic ad agencies and media companies. D'RENTALS provides the cutting-edge camera and lighting equipment required to produce standout commercial content.",
      "We specialize in rapid deployment of commercial production gear. Whether you need a high-speed camera for a product shoot or comprehensive studio lighting for a fashion editorial, we have it in stock.",
      "Our seamless rental process and direct delivery to Madhapur offices and studios mean you spend less time coordinating logistics and more time focusing on creative execution."
    ],
    popularCategories: ["Commercial Cinema Cameras", "Studio Lighting", "Macro Lenses", "Product Turntables", "Wireless Video"],
    faqs: [
      {
        question: "Do you have lighting gear suitable for high-end product commercials?",
        answer: "Yes, we stock a variety of precision lighting tools, including Aputure COB lights, softboxes, and modifiers ideal for achieving the perfect commercial look."
      },
      {
        question: "Can we set up a corporate account for frequent rentals in Madhapur?",
        answer: "We welcome corporate accounts! Ad agencies and production houses in Madhapur can benefit from streamlined billing and priority booking."
      }
    ]
  },
  begumpet: {
    headline: "BEGUMPET CAMERA DELIVERY",
    subheadline: "Centralized Delivery for Urban Shoots",
    description: [
      "Centrally located Begumpet is a popular spot for urban photography, interviews, and corporate events. D'RENTALS provides the perfect equipment to capture the essence of this vibrant area.",
      "We offer compact, high-performance camera systems that are easy to maneuver in busy urban environments, along with portable audio and lighting solutions perfect for on-the-go interviews.",
      "Our delivery network ensures that whether you're shooting near the old airport or at a premier hotel in Begumpet, your gear arrives promptly and reliably."
    ],
    popularCategories: ["Compact Mirrorless", "Portable Lighting", "Lavalier Mics", "Travel Tripods", "Run-and-Gun Kits"],
    faqs: [
      {
        question: "What gear do you recommend for run-and-gun street interviews?",
        answer: "We highly recommend a compact mirrorless camera on a lightweight gimbal, paired with a wireless lavalier microphone system for crisp audio in noisy environments."
      },
      {
        question: "Can you deliver directly to a hotel or event venue in Begumpet?",
        answer: "Yes, we frequently deliver to major hotels and event spaces in Begumpet. Just provide the venue details and an on-site contact person."
      }
    ]
  }
}

// Generate metadata for each area page
export async function generateMetadata({ params }: { params: { area: string } }): Promise<Metadata> {
  const area = params.area.toLowerCase()

  // Check if area is valid
  if (!validAreas.includes(area)) {
    return {
      title: "Area Not Found | D'RENTALS by Penmen Studios",
      description: "The requested area could not be found.",
    }
  }

  // Format area name for display (convert hyphenated to spaces and capitalize)
  const formattedArea = area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Get area-specific metadata or use default
  const metadata = areaMetadata[area] || {
    title: `Camera Rental in ${formattedArea} | Professional Equipment Delivery`,
    description: generateAreaDescription(formattedArea),
    keywords: [
      `camera rental ${area}`,
      `dslr rental ${area}`,
      `camera equipment ${area}`,
      `film gear ${area}`,
      `camera delivery ${area}`,
    ],
  }

  // Ensure we have a proper canonical URL for this area page
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(", "),
    // Add explicit path for canonical URL
    alternates: {
      canonical: `/areas/${area}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
    },
  }
}

// Update the component to ensure proper scroll behavior
export default async function AreaPage({ params }: { params: { area: string } }) {
  // Disable caching for this page
  unstable_noStore()

  const area = params.area.toLowerCase()

  // Check if area is valid
  if (!validAreas.includes(area)) {
    notFound()
  }

  // Format area name for display (convert hyphenated to spaces and capitalize)
  const formattedArea = area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Get area-specific content or use default
  const content = areaContent[area] || {
    headline: `CAMERA RENTAL IN ${formattedArea.toUpperCase()}`,
    subheadline: `Professional Equipment Delivered to ${formattedArea}`,
    description: [
      `D'RENTALS provides professional camera equipment rental with delivery to ${formattedArea}. Our extensive inventory includes DSLRs, cinema cameras, lenses, and accessories for all your production needs.`,
      `Based in Hyderabad, we offer reliable delivery services to ${formattedArea}, ensuring you have access to high-quality equipment without the need for transportation. Our flexible rental options cater to projects of various durations and budgets.`,
      `Whether you're a professional filmmaker or an amateur photographer in ${formattedArea}, our equipment will help you achieve professional results. Contact our team to discuss your specific equipment needs.`,
    ],
    popularCategories: ["DSLR Cameras", "Cinema Cameras", "Camera Lenses", "Lighting Equipment", "Audio Equipment"],
    faqs: [
      {
        question: `How does equipment delivery work in ${formattedArea}?`,
        answer: `We coordinate delivery times based on your schedule. Our team will deliver the equipment to your specified location in ${formattedArea} and provide a brief overview of the gear.`,
      },
      {
        question: `What types of cameras are available for rent in ${formattedArea}?`,
        answer: `We offer a wide range of equipment including DSLRs, mirrorless cameras, cinema cameras, RED cameras, and more. Browse our equipment catalog to see our full inventory.`,
      },
      {
        question: `How far in advance should I book equipment for delivery to ${formattedArea}?`,
        answer: `We recommend booking at least 48-72 hours in advance to ensure availability, especially for popular equipment. For urgent requests, contact us directly to check availability.`,
      },
      {
        question: `Is there a delivery fee for ${formattedArea}?`,
        answer: `Delivery fees vary based on location and equipment volume. Contact us for a quote specific to your delivery in ${formattedArea}.`,
      },
    ],
  }

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        <FAQSchema faqs={content.faqs} />
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Areas", href: "/areas" }, { label: formattedArea }]} />

          <div className="relative py-20 bg-zinc-950 border-b border-zinc-800">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-block mb-4 px-3 py-1 border border-red-500 bg-zinc-950">
                  <span className="text-red-400 font-mono text-sm tracking-widest">EQUIPMENT DELIVERY</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide leading-tight">
                  {content.headline}
                </h1>
                <p className="text-xl text-zinc-300 mb-6 max-w-2xl font-body">{content.subheadline}</p>
              </div>
            </div>
          </div>

          <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Camera Equipment Rental in {formattedArea}
                  </h2>

                  {content.description.map((paragraph, index) => (
                    <p key={index} className="text-zinc-300 mb-4 font-body">
                      {paragraph}
                    </p>
                  ))}

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                      <h3 className="font-heading text-xl text-white mb-4">POPULAR EQUIPMENT CATEGORIES</h3>
                      <ul className="space-y-2">
                        {content.popularCategories.map((category, index) => (
                          <li key={index} className="flex items-center gap-2 text-zinc-300">
                            <Camera className="h-4 w-4 text-red-500" />
                            <span>{category}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900 military-border">
                      <h3 className="font-heading text-xl text-white mb-4">CONTACT US</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                          <span className="text-zinc-300">Delivery available to all areas in {formattedArea}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-red-500" />
                          <a href={`tel:${siteConfig.location.phone}`} className="text-zinc-300 hover:text-white">
                            {siteConfig.location.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-red-500" />
                          <a href={`mailto:${siteConfig.location.email}`} className="text-zinc-300 hover:text-white">
                            {siteConfig.location.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
                      <Link href="/contact">INQUIRE ABOUT DELIVERY</Link>
                    </Button>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Popular Equipment for Rent in {formattedArea}
                  </h2>
                  <Suspense fallback={<EquipmentSkeleton />}>
                    <PopularEquipment />
                  </Suspense>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    Why Choose D&apos;RENTALS in {formattedArea}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">CONVENIENT DELIVERY</h3>
                      <p className="text-zinc-300">
                        We deliver camera equipment directly to your location in {formattedArea}, saving you time and
                        hassle.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">PROFESSIONAL EQUIPMENT</h3>
                      <p className="text-zinc-300">
                        Access high-quality, well-maintained cinema cameras and accessories from leading brands.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">FLEXIBLE RENTAL PERIODS</h3>
                      <p className="text-zinc-300">
                        Daily, weekly, and monthly rental options to accommodate projects of any duration.
                      </p>
                    </div>

                    <div className="p-6 border border-zinc-800 bg-zinc-900">
                      <h3 className="font-heading text-xl text-white mb-3">TECHNICAL SUPPORT</h3>
                      <p className="text-zinc-300">
                        Expert guidance and support to help you choose the right equipment for your specific needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-heading text-red-500 tracking-wide uppercase mb-6">
                    FAQs About Camera Rental in {formattedArea}
                  </h2>

                  <div className="space-y-6">
                    {content.faqs.map((faq, index) => (
                      <div key={index} className="p-6 border border-zinc-800 bg-zinc-900">
                        <h3 className="font-heading text-xl text-white mb-2">{faq.question}</h3>
                        <p className="text-zinc-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="p-6 border border-zinc-800 bg-zinc-900 mb-6">
                    <h3 className="font-heading text-xl text-white mb-4">EQUIPMENT CATEGORIES</h3>
                    <Suspense fallback={<div className="animate-pulse h-40 bg-zinc-800"></div>}>
                      <CategoryList />
                    </Suspense>
                  </div>

                  <div className="p-6 border border-zinc-800 bg-zinc-900 mb-6">
                    <h3 className="font-heading text-xl text-white mb-4">
                      SERVING AREAS NEAR {formattedArea.toUpperCase()}
                    </h3>
                    <ul className="space-y-2">
                      {validAreas
                        .filter((a) => a !== area)
                        .slice(0, 5)
                        .map((nearbyArea) => {
                          const displayArea = nearbyArea.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                          return (
                            <li key={nearbyArea}>
                              <Link
                                href={`/areas/${nearbyArea}`}
                                className="flex items-center gap-2 text-zinc-300 hover:text-white"
                              >
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span>{displayArea}</span>
                              </Link>
                            </li>
                          )
                        })}
                    </ul>
                  </div>

                  <div className="p-6 border border-red-500 bg-zinc-900">
                    <h3 className="font-heading text-xl text-white mb-4">NEED ASSISTANCE?</h3>
                    <p className="text-zinc-300 mb-4">
                      Contact our team for personalized equipment recommendations and delivery options in{" "}
                      {formattedArea}.
                    </p>
                    <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Link href="/contact">CONTACT US</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Component to display popular equipment
async function PopularEquipment() {
  // Disable caching for this component
  unstable_noStore()

  const equipment = await getPopularEquipmentForArea(4)

  return (
    <div>
      <EquipmentGrid equipment={equipment} />
      <div className="mt-6 text-center">
        <Button asChild variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent">
          <Link href="/equipment">VIEW ALL EQUIPMENT</Link>
        </Button>
      </div>
    </div>
  )
}

// Component to display categories
async function CategoryList() {
  // Disable caching for this component
  unstable_noStore()

  const categories = await getCategories()

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/equipment?category=${category.id}`}
            className="flex items-center gap-2 text-zinc-300 hover:text-white"
          >
            <Camera className="h-4 w-4 text-red-500" />
            <span>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
