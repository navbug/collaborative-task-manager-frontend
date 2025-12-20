import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { X } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: users } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split('T')[0],
          priority: task.priority,
          status: task.status,
          assignedToId: task.assignedTo?._id || ''
        }
      : {
          priority: TaskPriority.MEDIUM,
          status: TaskStatus.TODO
        }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        await updateTask.mutateAsync({
          id: task._id,
          data: {
            ...data,
            assignedToId: data.assignedToId || null
          }
        });
      } else {
        await createTask.mutateAsync({
          ...data,
          assignedToId: data.assignedToId || undefined
        });
      }
      onClose();
    } catch (error: any) {
      console.error('Failed to save task:', error);
      alert(error.response?.data?.error || 'Failed to save task');
    }
  };

  const priorityOptions = Object.values(TaskPriority).map((p) => ({
    value: p,
    label: p
  }));

  const statusOptions = Object.values(TaskStatus).map((s) => ({
    value: s,
    label: s
  }));

  const userOptions = [
    { value: '', label: 'Unassigned' },
    ...(users?.map((u) => ({ value: u._id, label: u.name })) || [])
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Enter task title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Due Date"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <Select
            label="Priority"
            {...register('priority')}
            options={priorityOptions}
            error={errors.priority?.message}
          />

          {task && (
            <Select
              label="Status"
              {...register('status')}
              options={statusOptions}
              error={errors.status?.message}
            />
          )}

          <Select
            label="Assign To"
            {...register('assignedToId')}
            options={userOptions}
            error={errors.assignedToId?.message}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};