export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500">
      {message}
    </div>
  )
}
