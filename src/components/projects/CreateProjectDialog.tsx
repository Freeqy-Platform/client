import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
    ProjectFormValues
} from "@/lib/validations/projectSchemas";
import { projectSchema } from "@/lib/validations/projectSchemas";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { projectService } from "@/services/projectService";
import {
  ProjectStatus,
  ProjectVisibility,
  ProjectStatusLabels,
  ProjectVisibilityLabels,
  statusStringToNumber,
  statusNumberToString,
  visibilityStringToNumber,
  visibilityNumberToString,
} from "@/types/projects";
import type { Category, Technology, Project } from "@/types/projects";
import { toast } from "sonner";
import { Loader2, ChevronDown } from "lucide-react";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    projectToEdit?: Project;
}

export function CreateProjectDialog({
    open,
    onOpenChange,
    onSuccess,
    projectToEdit
}: CreateProjectDialogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Helper to parse timespan string "d.hh:mm:ss" to default value if needed, 
    // or just use raw string for now as form expects string.

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            status: ProjectStatus.InProgress,
            visibility: ProjectVisibility.Private,
            technologyIds: [],
            categoryId: "",
            estimatedTime: "01:00:00", // Default 1 hour (Backend TIME column max is 24h)
        },
    });

    useEffect(() => {
        if (open) {
            fetchData();
            if (projectToEdit) {
                // Convert backend string values to form string enum values
                // Backend returns strings, so we can use them directly
                form.reset({
                    name: projectToEdit.name,
                    description: projectToEdit.description,
                    status: projectToEdit.status, // Already a string enum value
                    visibility: projectToEdit.visibility, // Already a string enum value
                    technologyIds: projectToEdit.technologies.map(t => t.id),
                    categoryId: projectToEdit.category.id,
                    estimatedTime: projectToEdit.estimatedTime,
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    status: ProjectStatus.InProgress,
                    visibility: ProjectVisibility.Private,
                    technologyIds: [],
                    categoryId: "",
                    estimatedTime: "01:00:00",
                });
            }
        }
    }, [open, projectToEdit]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch existing data
            let [cats, techs] = await Promise.all([
                projectService.getCategories(),
                projectService.getTechnologies()
            ]);

            // Seeding Logic: If categories are empty, create default ones
            if (!cats || cats.length === 0) {
                console.log("No categories found. Seeding defaults...");
                const defaultCategories = [
                    "Web Development", "Mobile App", "Desktop App", "AI & ML", "Game Dev"
                ];

                // create sequentially to avoid race conditions or rate limits
                for (const catName of defaultCategories) {
                    await projectService.createCategory(catName).catch(e => console.error("Failed to seed category", catName, e));
                }

                // Re-fetch
                cats = await projectService.getCategories();
            }

            // Seeding Logic: If technologies are empty, create default ones
            if (!techs || techs.length === 0) {
                console.log("No technologies found. Seeding defaults...");
                const defaultTechnologies = [
                    "React", "Node.js", "Python", ".NET", "Flutter", "TypeScript"
                ];

                for (const techName of defaultTechnologies) {
                    await projectService.createTechnology(techName).catch(e => console.error("Failed to seed technology", techName, e));
                }

                // Re-fetch
                techs = await projectService.getTechnologies();
            }

            setCategories(cats || []);
            setTechnologies(techs || []);

        } catch (error) {
            console.error("Failed to fetch form data", error);
            toast.error("Failed to load options. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: ProjectFormValues) => {
        try {
            setSubmitting(true);
            // Convert string enum values to numbers for backend
            const requestData = {
                ...values,
                status: statusStringToNumber(values.status),
                visibility: visibilityStringToNumber(values.visibility),
            };
            if (projectToEdit) {
                await projectService.updateProject(projectToEdit.id, requestData);
                toast.success("Project updated successfully");
            } else {
                await projectService.createProject(requestData);
                toast.success("Project created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save project", error);
            // Error handling is done by apiClient interceptor mostly, but safe to log
        } finally {
            setSubmitting(false);
        }
    };

    const selectedTechIds = form.watch("technologyIds");
    const selectedTechNames = technologies
        .filter(t => selectedTechIds.includes(t.id))
        .map(t => t.name)
        .join(", ");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{projectToEdit ? "Edit Project" : "Create New Project"}</DialogTitle>
                    <DialogDescription>
                        {projectToEdit ? "Update project details below." : "Fill in the details to create a new project."}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Website Redesign" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the project goals and scope..."
                                                className="resize-none min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(ProjectStatusLabels).map(([val, label]) => (
                                                        <SelectItem key={val} value={val}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="visibility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Visibility</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Visibility" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(ProjectVisibilityLabels).map(([val, label]) => (
                                                        <SelectItem key={val} value={val}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="estimatedTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estimated Time</FormLabel>
                                            <FormControl>
                                                <Input placeholder="d.hh:mm:ss" {...field} />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Format: hh:mm:ss or d.hh:mm:ss (Max 23:59:59 due to backend limits)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="technologyIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies</FormLabel>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between font-normal">
                                                    <span className="truncate">
                                                        {selectedTechNames || "Select Technologies"}
                                                    </span>
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full min-w-[300px]" align="start">
                                                <DropdownMenuLabel>Available Technologies</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {technologies.map((tech) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={tech.id}
                                                            checked={field.value?.includes(tech.id)}
                                                            onCheckedChange={(checked: boolean) => {
                                                                const newValue = checked
                                                                    ? [...(field.value || []), tech.id]
                                                                    : (field.value || []).filter((id) => id !== tech.id);
                                                                field.onChange(newValue);
                                                            }}
                                                        >
                                                            {tech.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {projectToEdit ? "Update Project" : "Create Project"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
