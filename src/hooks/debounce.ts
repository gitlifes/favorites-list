import { useState, useEffect } from 'react'

export function useDebounse(value: string, delay: number = 500): string {
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}
