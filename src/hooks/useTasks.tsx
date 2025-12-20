import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { CreateTaskData, UpdateTaskData, TaskFilters } from '../types';
import { useSocket } from '../context/SocketContext';
import { useEffect } from 'react';

export const useTasks = (filters?: TaskFilters) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => apiService.getTasks(filters),
    staleTime: 30000 // 30 seconds
  });

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (task: any) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'overdue'] });
    };

    const handleTaskUpdated = (task: any) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'overdue'] });
    };

    const handleTaskDeleted = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'overdue'] });
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket, queryClient]);

  return query;
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => apiService.getTaskById(id),
    enabled: !!id
  });
};

export const useCreatedTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'created'],
    queryFn: () => apiService.getCreatedTasks()
  });
};

export const useAssignedTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'assigned'],
    queryFn: () => apiService.getAssignedTasks()
  });
};

export const useOverdueTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'overdue'],
    queryFn: () => apiService.getOverdueTasks()
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => apiService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'assigned'] });
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] });
    }
  });
};