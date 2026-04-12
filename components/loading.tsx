import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 z-50">
      <div className="bg-zinc-900 p-8 border-2 border-red-600 flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
        <p className="text-white font-heading tracking-widest text-sm">LOADING</p>
      </div>
    </div>
  )
}
