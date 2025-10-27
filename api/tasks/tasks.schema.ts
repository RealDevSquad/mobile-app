import { z } from 'zod';

export const addProgressSchema = z
  .object({
    completed: z.string().optional(),
    planned: z.string().optional(),
    blockers: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        data.completed?.trim() || data.planned?.trim() || data.blockers?.trim()
      );
    },
    {
      message: 'Please fill at least one field',
      path: ['root'],
    }
  );

export const taskStatusUpdateSchema = z
  .object({
    fromDate: z.date({
      required_error: 'From date is required',
    }),
    toDate: z.date({
      required_error: 'To date is required',
    }),
    description: z.string().min(1, 'Description is required'),
  })
  .refine((data) => data.fromDate < data.toDate, {
    message: 'From date must be before to date',
    path: ['toDate'],
  });

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  type: z.string().optional(),
  endsOn: z.number().optional(),
  dependsOn: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  percentCompleted: z.number().min(0).max(100).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  type: z.string().optional(),
  endsOn: z.number().optional(),
  dependsOn: z.array(z.string()).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  percentCompleted: z.number().min(0).max(100).optional(),
});

export const submitProgressSchema = z
  .object({
    taskId: z.string().min(1, 'Task ID is required'),
    completed: z.string().optional(),
    planned: z.string().optional(),
    blockers: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        data.completed?.trim() || data.planned?.trim() || data.blockers?.trim()
      );
    },
    {
      message: 'Please fill at least one field',
      path: ['root'],
    }
  );

export const taskRequestFormSchema = z
  .object({
    proposedStartDate: z.date({
      required_error: 'Start date is required',
    }),
    proposedDeadline: z.date({
      required_error: 'Deadline is required',
    }),
    description: z.string().min(1, 'Timeline overview is required'),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.proposedStartDate >= today;
    },
    {
      message: 'Start date cannot be in the past',
      path: ['proposedStartDate'],
    }
  )
  .refine((data) => data.proposedStartDate < data.proposedDeadline, {
    message: 'Deadline must be after start date',
    path: ['proposedDeadline'],
  });

export type TAddProgressFormData = z.infer<typeof addProgressSchema>;
export type TTaskStatusUpdateFormData = z.infer<typeof taskStatusUpdateSchema>;
export type TCreateTaskFormData = z.infer<typeof createTaskSchema>;
export type TUpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type TUpdateTaskStatusFormData = z.infer<typeof updateTaskStatusSchema>;
export type TSubmitProgressFormData = z.infer<typeof submitProgressSchema>;
export type TTaskRequestFormData = z.infer<typeof taskRequestFormSchema>;
