import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseMutation<TVariables = any, TData = any>(
  query: string
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const mutate = async (variables?: TVariables): Promise<TData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc(query, variables || {});

      if (error) {
        setError(error);
        return null;
      }

      return data;
    } catch (err) {
      const postgrestError = err as PostgrestError;
      setError(postgrestError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}