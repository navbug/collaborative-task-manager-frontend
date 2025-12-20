import React, { useEffect } from 'react';
import { useCreatedTasks, useAssignedTasks, useOverdueTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TastCard';
import { TaskCardSkeleton } from '../components/SkeletonLoader';
import { ClipboardList, UserCheck, AlertCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';

export const Dashboard: React.FC = () => {
  const { data: createdTasks, isLoading: createdLoading, refetch: refetchCreated } = useCreatedTasks();
  const { data: assignedTasks, isLoading: assignedLoading, refetch: refetchAssigned } = useAssignedTasks();
  const { data: overdueTasks, refetch: refetchOverdue } = useOverdueTasks();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleRealTimeUpdate = () => {
      refetchCreated();
      refetchAssigned();
      refetchOverdue();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    socket.on('task:created', handleRealTimeUpdate);
    socket.on('task:updated', handleRealTimeUpdate);
    socket.on('task:deleted', handleRealTimeUpdate);

    return () => {
      socket.off('task:created', handleRealTimeUpdate);
      socket.off('task:updated', handleRealTimeUpdate);
      socket.off('task:deleted', handleRealTimeUpdate);
    };
  }, [socket, refetchCreated, refetchAssigned, refetchOverdue, queryClient]);

  const StatCard: React.FC<{
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, count, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border', 'bg').replace('600', '100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your tasks and activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tasks Assigned to You"
          count={assignedTasks?.length || 0}
          icon={<UserCheck className="w-6 h-6 text-blue-600" />}
          color="border-blue-600"
        />
        <StatCard
          title="Tasks You Created"
          count={createdTasks?.length || 0}
          icon={<ClipboardList className="w-6 h-6 text-green-600" />}
          color="border-green-600"
        />
        <StatCard
          title="Overdue Tasks"
          count={overdueTasks?.length || 0}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          color="border-red-600"
        />
      </div>

      {/* Tasks Assigned section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Assigned to You</h2>
        {assignedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : assignedTasks && assignedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No tasks assigned to you</p>
          </div>
        )}
      </section>

      {/* Tasks Created section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks You Created</h2>
        {createdLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : createdTasks && createdTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">You haven't created any tasks yet</p>
          </div>
        )}
      </section>

      {/* Overdue Tasks */}
      {overdueTasks && overdueTasks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Overdue Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overdueTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};