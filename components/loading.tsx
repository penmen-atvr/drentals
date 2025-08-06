import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-900 p-6 rounded-none border-2 border-red-500 flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-red-500 animate-spin mb-4" />
        <p className="text-white font-heading">LOADING</p>
      </div>
    </div>
  )
}
