import { z } from "zod";

export const oooFormSchema = z
  .object({
    fromDate: z.date(),
    toDate: z.date(),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.fromDate >= today;
    },
    {
      message: "Start date cannot be in the past",
      path: ["fromDate"],
    }
  )
  .refine((data) => data.fromDate < data.toDate, {
    message: "Start date must be before end date",
    path: ["toDate"],
  });

export const statusUpdateSchema = z
  .object({
    fromDate: z.date(),
    toDate: z.date(),
    description: z.string().min(1, "Description is required"),
  })
  .refine((data) => data.fromDate < data.toDate, {
    message: "From date must be before to date",
    path: ["toDate"],
  });

export const userSearchSchema = z.object({
  search: z.string().min(1, "Search query is required"),
  size: z.number().min(1).max(100).optional().default(10),
});

export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  github_display_name: z.string().optional(),
  github_id: z.string().optional(),
  linkedin_id: z.string().optional(),
  twitter_id: z.string().optional(),
  instagram_id: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional(),
});

export type TOOOFormData = z.infer<typeof oooFormSchema>;
export type TStatusUpdateFormData = z.infer<typeof statusUpdateSchema>;
export type TUserSearchFormData = z.infer<typeof userSearchSchema>;
export type TUserProfileUpdateFormData = z.infer<typeof userProfileUpdateSchema>;
