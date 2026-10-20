import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

// Busca os dados sempre que a tela ganha foco (por exemplo, ao voltar de um formulário).
// `loader` precisa ser estável: uma função do módulo api ou criada com useCallback.
export function useFocusData(loader) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode) => {
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'retry') setLoading(true);
      try {
        setData(await loader());
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loader],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return {
    data,
    error,
    loading,
    refreshing,
    retry: () => load('retry'),
    refresh: () => load('refresh'),
  };
}
