import { z } from "zod";

export const extensionRequestSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    reason: z.string().min(1, "Reason is required"),
    newDeadline: z.date({
      message: "New deadline is required",
    }),
    taskId: z.string().min(1, "Task ID is required"),
    assignee: z.string().min(1, "Assignee is required"),
    oldEndsOn: z.number().min(0, "Old deadline is required"),
  })
  .refine(
    (data) => {
      const oldDeadlineDate = new Date(data.oldEndsOn * 1000);
      return data.newDeadline > oldDeadlineDate;
    },
    {
      message: "New deadline must be after the current deadline",
      path: ["newDeadline"],
    }
  );

export const updateExtensionRequestStatusSchema = z.object({
  status: z.enum(["APPROVED", "DENIED"], {
    message: "Status is required",
  }),
  reason: z.string().optional(),
});

export const getExtensionRequestsSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "DENIED"]).optional(),
  next: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  size: z.string().optional(),
  q: z.string().optional(),
});

export const extensionRequestFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  newEndsOn: z.date({
    message: "New deadline is required",
  }),
});

export const updateExtensionRequestFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().min(1, "Reason is required"),
  newEndsOn: z.date({
    message: "New deadline is required",
  }),
});

export type TExtensionRequestFormData = z.infer<typeof extensionRequestSchema>;
export type TExtensionRequestFormFormData = z.infer<typeof extensionRequestFormSchema>;
export type TUpdateExtensionRequestFormFormData = z.infer<typeof updateExtensionRequestFormSchema>;
export type TUpdateExtensionRequestStatusFormData = z.infer<
  typeof updateExtensionRequestStatusSchema
>;
export type TGetExtensionRequestsFormData = z.infer<typeof getExtensionRequestsSchema>;
