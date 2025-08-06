import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function EquipmentCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden bg-zinc-900 border-zinc-800 rounded-none">
      <Skeleton className="aspect-[4/3] w-full bg-zinc-800" />
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-16 bg-zinc-800" />
          <Skeleton className="h-5 w-20 bg-zinc-800" />
        </div>
        <Skeleton className="h-6 w-full mb-1 bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <Skeleton className="h-4 w-20 mb-1 bg-zinc-800" />
          <Skeleton className="h-6 w-16 bg-zinc-800" />
        </div>
      </CardFooter>
    </Card>
  )
}

export function EquipmentSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EquipmentCardSkeleton key={i} />
      ))}
    </div>
  )
}
