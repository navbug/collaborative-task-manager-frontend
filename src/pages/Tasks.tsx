import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TastCard';
import { TaskForm } from '../components/TaskForm';
import { TaskCardSkeleton } from '../components/SkeletonLoader';
import { Button } from '../components/Button';
import { Plus, Filter } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types';
import { useSocket } from '../context/SocketContext';

export const Tasks: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
    sortBy?: 'dueDate' | 'createdAt' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: tasksData, isLoading, refetch } = useTasks(filters);
  const { socket } = useSocket();

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleRealTimeUpdate = () => {
      refetch();
    };

    socket.on('task:created', handleRealTimeUpdate);
    socket.on('task:updated', handleRealTimeUpdate);
    socket.on('task:deleted', handleRealTimeUpdate);

    return () => {
      socket.off('task:created', handleRealTimeUpdate);
      socket.off('task:updated', handleRealTimeUpdate);
      socket.off('task:deleted', handleRealTimeUpdate);
    };
  }, [socket, refetch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
          <p className="text-gray-600">
            {tasksData ? `${tasksData.total} total tasks` : 'Loading...'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Filter & Sort</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as TaskStatus || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Statuses</option>
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value as TaskPriority || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Priorities</option>
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasksData && tasksData.tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasksData.tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No tasks found</p>
          <Button onClick={() => setIsCreating(true)} className="mt-4">
            Create Your First Task
          </Button>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreating && <TaskForm onClose={() => setIsCreating(false)} />}
    </div>
  );
};