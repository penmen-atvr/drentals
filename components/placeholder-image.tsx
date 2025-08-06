import { Camera } from "lucide-react"

export default function PlaceholderImage({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-zinc-800 ${className}`}>
      <Camera className="h-16 w-16 text-zinc-600" />
    </div>
  )
}
