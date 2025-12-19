import { z } from "zod";

export const profileSchema = z.object({
  FirstName: z.string().min(2, "First name must be at least 2 characters"),
  LastName: z.string().min(2, "Last name must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  track: z.string().optional(),
});

export const summarySchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters"),
});

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
});

export const availabilitySchema = z.object({
  availability: z.string().min(1, "Availability is required"),
});

export const skillsSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export const socialLinksSchema = z.object({
  socialLinks: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      link: z.string().url("Must be a valid URL"),
    })
  ),
});

export const educationSchema = z.object({
  educations: z.array(
    z.object({
      institutionName: z.string().min(1, "Institution name is required"),
      degree: z.string().nullish(),
      fieldOfStudy: z.string().nullish(),
      startDate: z.string().nullish(),
      endDate: z.string().nullish(),
      grade: z.string().nullish(),
      description: z.string().nullish(),
    })
  ),
});

export const certificatesSchema = z.object({
  certificates: z.array(
    z.object({
      certificateName: z.string().min(1, "Certificate name is required"),
      issuer: z.string().nullish(),
      issueDate: z.string().nullish(),
      expirationDate: z.string().nullish(),
      credentialId: z.string().nullish(),
      credentialUrl: z
        .union([
          z.string().url("Must be a valid URL"),
          z.string().length(0),
          z.null(),
        ])
        .optional(),
      description: z.string().nullish(),
    })
  ),
});

