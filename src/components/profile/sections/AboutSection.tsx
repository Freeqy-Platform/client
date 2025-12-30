import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Form } from "../../ui/form";
import { FormField, FormItem, FormControl, FormMessage } from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { summarySchema } from "../../../lib/validations/profileSchemas";
import type { User, UpdateSummaryRequest } from "../../../types/user";

interface AboutSectionProps {
  user: User;
  onUpdate: (data: UpdateSummaryRequest) => Promise<void>;
  isUpdating: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateSummaryRequest>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: user.summary || "",
    },
  });

  React.useEffect(() => {
    form.reset({ summary: user.summary || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.summary]);

  const onSubmit = async (data: UpdateSummaryRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">About</CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                {user.summary ? "Edit" : "Add"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Summary</DialogTitle>
                <DialogDescription className="text-sm">
                  Tell us about yourself.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder="Write a brief summary about yourself..."
                            className="text-sm resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} size="sm">
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {user.summary ? (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {user.summary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No summary added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

