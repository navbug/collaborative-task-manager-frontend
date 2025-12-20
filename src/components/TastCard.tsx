import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Calendar, User, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteTask } from '../hooks/useTasks';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800'
};

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.REVIEW]: 'bg-purple-100 text-purple-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteTask = useDeleteTask();

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED;

  const handleDelete = async () => {
    if (window.confirm('Do you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(task._id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (isEditing) {
    return <TaskForm task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};