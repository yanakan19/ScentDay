import { useMemo } from 'react';
import { FRAGRANCES, fragById } from '@/data/fragrances';
import { searchFragrances } from '@/services/catalog';

/**
 * Read-only access to the fragrance catalog + search.
 * TODO: swap the in-memory catalog for a paginated API query when the backend
 *   lands (keep this hook's signature so screens don't change).
 */
export function useFragrances(query?: string) {
  const results = useMemo(() => (query ? searchFragrances(query) : FRAGRANCES), [query]);
  return { all: FRAGRANCES, results, fragById };
}
