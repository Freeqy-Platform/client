import React from "react";
import { Form } from "../../ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { DialogFooter } from "../../ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateCertificatesRequest, CertificateRequest } from "../../../types/user";

interface CertificatesEditorProps {
  form: UseFormReturn<UpdateCertificatesRequest>;
  onSubmit: (data: UpdateCertificatesRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const CertificatesEditor: React.FC<CertificatesEditorProps> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const certificates = form.watch("certificates") || [];

  const addCertificate = () => {
    form.setValue("certificates", [
      ...certificates,
      {
        certificateName: "",
        issuer: null,
        issueDate: null,
        expirationDate: null,
        credentialId: null,
        credentialUrl: null,
        description: null,
      },
    ]);
  };

  const removeCertificate = (index: number) => {
    form.setValue(
      "certificates",
      certificates.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-3">
          {certificates.map((cert: CertificateRequest, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-3 space-y-2.5 bg-muted/30"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h4 className="font-semibold text-sm">
                  Certificate #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertificate(index)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`certificates.${index}.certificateName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Certificate Name *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-8 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`certificates.${index}.issuer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Issuer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`certificates.${index}.issueDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Issue Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certificates.${index}.expirationDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Expiration Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`certificates.${index}.credentialUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Credential URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="https://..."
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`certificates.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={2}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addCertificate}
            size="sm"
            className="w-full"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Certificate
          </Button>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

