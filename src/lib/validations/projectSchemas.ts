import { z } from "zod";
import { ProjectStatus, ProjectVisibility } from "@/types/projects";

// Schema for creating/updating a project
export const projectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
    status: z.nativeEnum(ProjectStatus),
    visibility: z.nativeEnum(ProjectVisibility),
    technologyIds: z.array(z.string()).min(1, "Select at least one technology"),
    categoryId: z.string().min(1, "Category is required"),
    estimatedTime: z.string().regex(/^(\d+\.)?\d{1,2}:\d{2}:\d{2}$/, "Format must be hh:mm:ss or d.hh:mm:ss (Max 23:59:59 due to backend limits)"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
