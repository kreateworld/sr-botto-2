import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseQuery<T = any>(
  query: string,
  params?: any[],
  options?: { enabled?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enabled = options?.enabled ?? true;
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    async function executeQuery() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.rpc(query, params ? { params } : undefined);
        
        if (error) {
          setError(error);
          return;
        }

        setData(data);
        setError(null);
      } catch (err) {
        setError(err as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    }

    executeQuery();
  }, [query, JSON.stringify(params), options?.enabled]);

  return { data, error, isLoading };
}