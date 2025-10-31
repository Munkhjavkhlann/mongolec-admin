"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { CREATE_TENANT, UPDATE_TENANT } from "@/graphql/mutations/tenant";
import { toast } from "sonner";
import type { Tenant, TenantStatus, TenantPlan } from "../types";

interface TenantFormProps {
  mode?: "create" | "edit";
  tenantId?: string;
  initialData?: Tenant;
}

export function TenantForm({
  mode = "create",
  tenantId,
  initialData,
}: TenantFormProps) {
  const router = useRouter();
  const [createTenant, { loading: isCreating }] = useMutation(CREATE_TENANT);
  const [updateTenant, { loading: isUpdating }] = useMutation(UPDATE_TENANT);
  const isSubmitting = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    domain: "",
    isActive: true,
    status: "ACTIVE" as TenantStatus,
    plan: "FREE" as TenantPlan,
  });

  // Initialize form with existing tenant data
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        domain: initialData.domain || "",
        isActive: initialData.isActive ?? true,
        status: initialData.status || "ACTIVE",
        plan: initialData.plan || "FREE",
      });
    }
  }, [initialData, mode]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? generateSlug(name) : prev.slug,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const input = {
        name: formData.name,
        slug: formData.slug,
        domain: formData.domain || null,
        isActive: formData.isActive,
        status: formData.status,
        plan: formData.plan,
      };

      if (mode === "edit" && tenantId) {
        await updateTenant({
          variables: { id: tenantId, input },
          refetchQueries: ["GetTenants", "GetTenantById"],
        });
        toast.success("Tenant updated successfully");
      } else {
        await createTenant({
          variables: { input },
          refetchQueries: ["GetTenants"],
        });
        toast.success("Tenant created successfully");
      }

      router.push("/tenants");
    } catch (error: unknown) {
      console.error("Failed to save tenant:", error);
      if (error instanceof Error) {
        toast.error(
          error.message ||
            `Failed to ${mode === "edit" ? "update" : "create"} tenant`
        );
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Organization details and identifiers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter organization name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="organization-slug"
              required
              disabled={isSubmitting}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Slug must be lowercase letters, numbers, and hyphens only"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Custom Domain</Label>
            <Input
              id="domain"
              type="url"
              value={formData.domain}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, domain: e.target.value }))
              }
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Optional custom domain for this organization
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status & Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Plan</CardTitle>
          <CardDescription>
            Organization status and subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TenantStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select
              value={formData.plan}
              onValueChange={(value: TenantPlan) =>
                setFormData((prev) => ({ ...prev, plan: value }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this organization
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {mode === "create" ? "Create Tenant" : "Update Tenant"}
        </Button>
      </div>
    </form>
  );
}
