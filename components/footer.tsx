import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-10 pb-6">
      <div className="container mx-auto px-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">d&apos;Rentals</h3>
          <p className="text-sm">
            High-quality camera, lens &amp; lighting gear delivered anywhere in Hyderabad. Shoot more, own less.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="font-semibold mb-2 text-white">Navigate</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/equipment" className="hover:text-white">
                Equipment
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-white">
                Brands
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2 text-white">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy&nbsp;Policy
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-white">
                Return&nbsp;Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-white">
                Terms&nbsp;&amp;&nbsp;Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2 text-white">Get in Touch</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="mailto:admin@penmenstudios.com" className="hover:text-white">
                admin@penmenstudios.com
              </a>
            </li>
            <li>077948 72701</li>
            <li>nearby Pure o natural, Rajeev Nagar, Hyderabad, Telangana 500045</li>
          </ul>
        </div>
      </div>

      <Separator className="my-6 bg-zinc-800" />

      <p className="text-center text-xs text-zinc-500">© {year} d&apos;Rentals. All rights reserved.</p>
    </footer>
  )
}
