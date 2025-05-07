"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"

type Book = {
  id: string
  title: string
  authors: string[]
  publishedDate: string
  description: string
  thumbnail: string
  price: number
}

interface BookGridProps {
  query?: string
  featured?: boolean
  limit?: number
  sortBy?: string
}

export function BookGrid({ query, featured = false, limit, sortBy }: BookGridProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBooks() {
      setIsLoading(true)
      try {
        const endpoint = featured
          ? "/api/books/featured"
          : `/api/books?${query ? `q=${encodeURIComponent(query)}` : ""}${limit ? `&limit=${limit}` : ""}${sortBy ? `&sort=${sortBy}` : ""}`

        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error("Failed to fetch books")
        }

        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [query, featured, limit, sortBy])

  const handleAddToCart = (book: Book) => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      thumbnail: book.thumbnail,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array(limit || 8)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col text-xs">
              <div className="aspect-[2/3] relative bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-2 flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-2 pt-0 flex justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No books found</h3>
        <p className="text-muted-foreground">Try searching with different keywords</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden flex flex-col text-xs">
          <div className="aspect-[2/3] relative bg-muted">
            <Link href={`/books/${book.id}`}>
              {book.thumbnail ? (
                <img
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  className="object-cover w-full h-full hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </Link>
          </div>
          <CardContent className="p-2 flex-grow">
            <Link href={`/books/${book.id}`} className="font-medium hover:underline line-clamp-2 h-10">
              {book.title}
            </Link>
            <p className="text-xs text-muted-foreground mt-1">{book.authors?.join(", ") || "Unknown author"}</p>
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-between items-center">
          <div className="font-bold text-xs">LKR {book.price.toFixed(2)}</div>
          <Button size="sm" onClick={() => handleAddToCart(book)}>
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
          </Button>
        </CardFooter>
      </Card>
    ))}
    </div>
  )
}
