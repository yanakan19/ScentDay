import { useStore } from '@/store/useStore';

/**
 * Convenience hook around the Drops (karma) system.
 * TODO: when a backend exists, sync `addDrops` to the server and read the
 *   authoritative total here instead of the local store.
 */
export function useDrops() {
  const total = useStore((s) => s.drops.total);
  const breakdown = useStore((s) => s.drops.breakdown);
  const addDrops = useStore((s) => s.addDrops);
  return { total, breakdown, addDrops };
}
