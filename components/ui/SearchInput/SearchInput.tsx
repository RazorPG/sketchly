"use client"

import { Input } from "@heroui/react"

interface SearchInputProps {
  placeholder?: string
}

export default function SearchInput({
  placeholder = "Search",
}: SearchInputProps) {
  return (
    <Input className="w-full sm:w-65 rounded-full" placeholder={placeholder} />
  )
}
