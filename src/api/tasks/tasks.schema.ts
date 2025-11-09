import { z } from "zod";

export const addProgressSchema = z
  .object({
    completed: z.string().optional(),
    planned: z.string().optional(),
    blockers: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.completed?.trim() || data.planned?.trim() || data.blockers?.trim();
    },
    {
      message: "Please fill at least one field",
      path: ["root"],
    }
  );

export const taskStatusUpdateSchema = z
  .object({
    fromDate: z.date({
      message: "From date is required",
    }),
    toDate: z.date({
      message: "To date is required",
    }),
    description: z.string().min(1, "Description is required"),
  })
  .refine((data) => data.fromDate < data.toDate, {
    message: "From date must be before to date",
    path: ["toDate"],
  });

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  type: z.string().optional(),
  endsOn: z.number().optional(),
  dependsOn: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  percentCompleted: z.number().min(0).max(100).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  type: z.string().optional(),
  endsOn: z.number().optional(),
  dependsOn: z.array(z.string()).optional(),
});

export const updateTaskStatusFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
  percentCompleted: z
    .number()
    .min(0, "Progress must be at least 0")
    .max(100, "Progress cannot exceed 100"),
});

export const submitProgressSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  completed: z.string().min(1, "Completed work is required"),
  planned: z.string().min(1, "Planned work is required"),
  blockers: z.string().min(1, "Blockers is required"),
  type: z.string().min(1, "Type is required"),
});

export const addProgressFormSchema = z.object({
  completed: z.string().min(1, "Completed work is required"),
  planned: z.string().min(1, "Planned work is required"),
  blockers: z.string().min(1, "Blockers is required"),
});

export const githubUrlSchema = z.object({
  githubUrl: z
    .string()
    .min(1, "GitHub issue URL is required")
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url.trim());
          return urlObj.hostname.includes("github.com");
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid GitHub issue URL",
      }
    ),
});

export const taskRequestFormSchema = z
  .object({
    proposedStartDate: z.date({
      message: "Start date is required",
    }),
    proposedDeadline: z.date({
      message: "Deadline is required",
    }),
    description: z.string().min(1, "Timeline overview is required"),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.proposedStartDate >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["proposedStartDate"],
    }
  )
  .refine((data) => data.proposedStartDate < data.proposedDeadline, {
    message: "Deadline must be after start date",
    path: ["proposedDeadline"],
  });

export type TAddProgressFormData = z.infer<typeof addProgressSchema>;
export type TTaskStatusUpdateFormData = z.infer<typeof taskStatusUpdateSchema>;
export type TCreateTaskFormData = z.infer<typeof createTaskSchema>;
export type TUpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type TUpdateTaskStatusFormData = z.infer<typeof updateTaskStatusFormSchema>;
export type TSubmitProgressFormData = z.infer<typeof submitProgressSchema>;
export type TAddProgressFormFormData = z.infer<typeof addProgressFormSchema>;
export type TGithubUrlFormData = z.infer<typeof githubUrlSchema>;
export type TTaskRequestFormData = z.infer<typeof taskRequestFormSchema>;
