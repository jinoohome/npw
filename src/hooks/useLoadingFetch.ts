import { useLoading } from '../context/LoadingContext';

export const useLoadingFetch = () => {
  const { setIsLoading } = useLoading();

  const fetchWithLoading = async (
    apiCall: () => Promise<any>,
    loadingMessage?: string
  ) => {
    try {
      setIsLoading(true);
      const result = await apiCall();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchWithLoading };
}; 