import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="py-32 md:py-48 bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-3 py-1 border border-red-600 bg-zinc-950">
            <span className="text-red-500 font-mono text-sm tracking-widest">CAMERA RENTALS IN HYDERABAD</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-wide leading-tight">
            <span className="text-red-500">D&apos;RENTALS</span> CINEMA EQUIPMENT
          </h1>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl font-body">
            Access professional cinema cameras, DSLRs, 4K cameras, RED cameras, GoPro cameras, lenses, and accessories
            curated by Penmen Studios for industry professionals in Hyderabad, Kukatpally, Dilsukhnagar and across
            Telangana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white rounded-none px-8 py-6 text-base font-heading"
            >
              <Link href="/equipment">BROWSE EQUIPMENT</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-zinc-600 hover:bg-zinc-800 rounded-none px-8 py-6 text-base font-heading"
            >
              <Link href="/about">LEARN MORE</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
