"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function BookSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedQuery = searchQuery.trim()
      const url = new URL(window.location.href)
      if (trimmedQuery) {
        url.searchParams.set("q", trimmedQuery)
      } else {
        url.searchParams.delete("q")
      }
      router.replace(url.toString(), { scroll: false })
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/books?q=${encodeURIComponent(trimmedQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search books..."
          className="pl-8"
          value={searchQuery}
          onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}
