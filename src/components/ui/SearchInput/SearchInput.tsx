"use client"

interface SearchInputProps {
  placeholder?: string
}

export default function SearchInput({
  placeholder = "Search",
}: SearchInputProps) {
  return (
    <input
      suppressHydrationWarning
      className="w-full sm:w-65 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
      placeholder={placeholder}
      type="text"
    />
  )
}
