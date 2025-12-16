import React from "react";
import { useMe } from "../hooks/user/userHooks";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Globe,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

/**
 * ProfilePage - View current user profile
 * Example usage of useMe and useUserPhoto hooks
 */
const ProfilePage: React.FC = () => {
  const { data: user, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load profile. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <p>No profile data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const photoUrl =
    user.photoUrl ?? (user.photo ? String(user.photo) : undefined);

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim() ||
    user.userName?.slice(0, 2).toUpperCase() ||
    "U";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  {photoUrl && (
                    <AvatarImage
                      src={photoUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-xl font-semibold bg-[var(--purple)] text-[var(--purple-foreground)]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  {user.userName && (
                    <p className="text-muted-foreground">@{user.userName}</p>
                  )}
                  {user.track && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.track}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                  {user.isEmailConfirmed && (
                    <span className="text-xs text-success">✓ Verified</span>
                  )}
                </div>
              )}
              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phoneNumber}</span>
                </div>
              )}
              {user.availability && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.availability}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {user.summary && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{user.summary}</p>
              </div>
            )}

            {/* Social Links */}
            {user.socialLinks && (
              <div>
                <h3 className="font-semibold mb-2">Social Links</h3>
                <div className="flex gap-4">
                  {user.socialLinks.github && (
                    <a
                      href={user.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({skill.level})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {user.educations && user.educations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.educations.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution}
                  </p>
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-muted-foreground">
                      {edu.fieldOfStudy}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Certificates */}
        {user.certificates && user.certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.certificates.map((cert, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuingOrganization}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Issued: {cert.issueDate}
                    {cert.expiryDate && ` - Expires: ${cert.expiryDate}`}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
