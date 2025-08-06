"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { truncateDescription } from "@/lib/meta-description"

interface MetaDescriptionManagerProps {
  currentDescription: string
  pagePath: string
  onSave: (description: string) => Promise<void>
}

/**
 * Admin component for managing meta descriptions
 * This would be used in an admin panel, not on the public site
 */
export default function MetaDescriptionManager({ currentDescription, pagePath, onSave }: MetaDescriptionManagerProps) {
  const [description, setDescription] = useState(currentDescription)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const characterCount = description.length
  const isOverLimit = characterCount > 160

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      await onSave(description)
      setMessage("Meta description saved successfully!")
    } catch (error) {
      setMessage("Error saving meta description. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4 border border-zinc-800 bg-zinc-900 rounded-none">
      <div className="mb-4">
        <Label htmlFor="meta-description" className="text-white font-mono mb-2 block">
          META DESCRIPTION FOR: {pagePath}
        </Label>
        <Textarea
          id="meta-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white font-body resize-none h-24"
          placeholder="Enter meta description for this page..."
        />
        <div className="mt-2 flex justify-between items-center">
          <span className={`text-sm ${isOverLimit ? "text-red-500" : "text-zinc-400"}`}>
            {characterCount}/160 characters
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setDescription(truncateDescription(description))}
            className="text-zinc-400 border-zinc-700 hover:text-white"
          >
            Optimize Length
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={message.includes("Error") ? "text-red-500" : "text-green-500"}>{message}</span>
        <Button
          onClick={handleSave}
          disabled={isSaving || isOverLimit}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isSaving ? "Saving..." : "Save Description"}
        </Button>
      </div>
    </div>
  )
}
