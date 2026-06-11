interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        ⌕
      </span>
      <input
        className="input pl-10"
        type="search"
        inputMode="search"
        value={value}
        placeholder={placeholder ?? 'Search…'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
