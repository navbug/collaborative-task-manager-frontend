import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getAllUsers(),
    staleTime: 5 * 60 * 1000 // 5 mins
  });
};