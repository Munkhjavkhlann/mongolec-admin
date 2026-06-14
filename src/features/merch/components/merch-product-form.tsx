"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  SingleImageUpload,
  SingleImageUploadRef,
} from "@/components/single-image-upload";
import { Loader2, Save } from "lucide-react";
import { FormSection } from "@/components/admin";
import { VariantBuilder } from "./variant-builder";
import {
  CREATE_MERCH_PRODUCT,
  UPDATE_MERCH_PRODUCT,
} from "@/graphql/mutations/merch";
import { GET_MERCH_CATEGORIES } from "@/graphql/queries/merch";
import { toast } from "sonner";
import type { MerchProduct } from "../types";

interface ProductOption {
  id: string;
  name: { en: string; mn: string };
  values: Array<{ en: string; mn: string }>;
}

interface Variant {
  id: string;
  sku: string;
  title?: { en: string; mn: string };
  optionValues: Array<{
    option: { en: string; mn: string };
    value: { en: string; mn: string };
  }>;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  image?: string;
  position: number;
}

interface MerchProductFormProps {
  mode?: "create" | "edit" | "view";
  language: "en" | "mn";
  productId?: string;
  initialData?: MerchProduct;
}

export function MerchProductForm({
  mode = "create",
  language,
  productId,
  initialData,
}: MerchProductFormProps) {
  const router = useRouter();
  const [createProduct, { loading: isCreating }] =
    useMutation(CREATE_MERCH_PRODUCT);
  const [updateProduct, { loading: isUpdating }] =
    useMutation(UPDATE_MERCH_PRODUCT);
  const { data: categoriesData } = useQuery<{
    getMerchCategories: Array<{ id: string; name: string | { en?: string; mn?: string }; slug: string }>;
  }>(GET_MERCH_CATEGORIES, { variables: { language } });
  const categories = categoriesData?.getMerchCategories ?? [];
  const isSubmitting = isCreating || isUpdating;
  const isReadOnly = mode === "view";

  const featuredImageRef = useRef<SingleImageUploadRef>(null);

  const [formData, setFormData] = useState({
    name: { en: "", mn: "" },
    description: { en: "", mn: "" },
    shortDescription: { en: "", mn: "" },
    price: 0,
    compareAtPrice: 0,
    currency: "USD",
    status: "DRAFT",
    inventory: 0,
    minStock: 0,
    trackInventory: true,
    isFeatured: false,
    hasVariants: false,
    categoryId: "",
  });

  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Initialize form with existing product data
  useEffect(() => {
    if (initialData && mode !== "create") {
      const normalizeLangField = (field: string | { en: string; mn: string } | undefined) => {
        if (!field) return { en: "", mn: "" };
        if (typeof field === "string") return { en: field, mn: field };
        return field;
      };

      setFormData({
        name: normalizeLangField(initialData.name),
        description: normalizeLangField(initialData.description),
        shortDescription: normalizeLangField(initialData.shortDescription),
        price: initialData.price || 0,
        compareAtPrice: initialData.compareAtPrice || 0,
        currency: initialData.currency || "USD",
        status: initialData.status || "DRAFT",
        inventory: initialData.inventory || 0,
        minStock: initialData.minStock || 0,
        trackInventory: initialData.trackInventory ?? true,
        isFeatured: initialData.isFeatured ?? false,
        hasVariants: initialData.hasVariants ?? false,
        categoryId: initialData.category?.id || "",
      });

      if (initialData.options) {
        const rawOpts = initialData.options as ProductOption[]
        setOptions(rawOpts.map((opt, i) => ({ ...opt, id: opt.id || `option-${i}` })))
      }

      if (initialData.variants) {
        setVariants(
          initialData.variants.map((v: any) => ({
            id: v.id,
            sku: v.sku || "",
            title: v.title,
            optionValues: v.optionValues || [],
            price: v.price || 0,
            compareAtPrice: v.compareAtPrice,
            inventory: v.inventory || 0,
            image: v.image,
            position: v.position || 0,
          }))
        );
      }
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) return;

    try {
      // Upload featured image first if one was selected
      let featuredImageUrl: string | null = initialData?.featuredImage || null;
      if (featuredImageRef.current && featuredImageFile) {
        toast.info("Uploading images...");
        featuredImageUrl = await featuredImageRef.current.uploadImage();
        if (!featuredImageUrl) {
          toast.error("Failed to upload featured image");
          return;
        }
      }

      // Prepare variant data for GraphQL
      const variantsInput = variants.map((v) => ({
        sku: v.sku,
        title: v.title,
        optionValues: v.optionValues,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        inventory: v.inventory,
        image: v.image,
        position: v.position,
        isAvailable: true,
      }));

      // Generate SKU from product name (only for create mode)
      const generateSKU = (name: string) => {
        const prefix = name
          .substring(0, 3)
          .toUpperCase()
          .replace(/[^A-Z]/g, "X");
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}-${timestamp}`;
      };

      const input = {
        sku:
          mode === "create"
            ? generateSKU(formData.name.en || formData.name.mn || "PRODUCT")
            : initialData?.sku,
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice || null,
        currency: formData.currency,
        inventory: formData.inventory,
        trackInventory: formData.trackInventory,
        minStock: formData.minStock || null,
        status: formData.status,
        isFeatured: formData.isFeatured,
        featuredImage: featuredImageUrl,
        categoryId: formData.categoryId || null,
        hasVariants: options.length > 0,
        options:
          options.length > 0
            ? options.map((opt) => ({
                name: opt.name,
                values: opt.values,
              }))
            : null,
        variants: variantsInput.length > 0 ? variantsInput : null,
      };

      if (mode === "edit" && productId) {
        await updateProduct({
          variables: { id: productId, input },
          refetchQueries: ["GetMerchProducts", "GetMerchProductById"],
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct({
          variables: { input },
          refetchQueries: ["GetMerchProducts"],
        });
        toast.success("Product created successfully");
      }

      router.push("/merch");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message ||
            `Failed to ${mode === "edit" ? "update" : "create"} product`
        );
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection
        title="Product Information"
        description={isReadOnly ? "Product details" : "Add product details"}
      >
          <div className="space-y-2">
            <Label htmlFor={`name-${language}`}>Product Name *</Label>
            <Input
              id={`name-${language}`}
              value={formData.name[language]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: { ...prev.name, [language]: e.target.value },
                }))
              }
              placeholder={
                language === "en" ? "Enter product name" : "Бүтээгдэхүүний нэр"
              }
              required={!isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${language}`}>Description</Label>
            <Textarea
              id={`description-${language}`}
              value={formData.description[language]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: {
                    ...prev.description,
                    [language]: e.target.value,
                  },
                }))
              }
              placeholder={
                language === "en"
                  ? "Product description..."
                  : "Бүтээгдэхүүний тодорхойлолт..."
              }
              rows={4}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`short-description-${language}`}>
              Short Description
            </Label>
            <Textarea
              id={`short-description-${language}`}
              value={formData.shortDescription[language]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: {
                    ...prev.shortDescription,
                    [language]: e.target.value,
                  },
                }))
              }
              placeholder={
                language === "en"
                  ? "Brief product description..."
                  : "Товч тодорхойлолт..."
              }
              rows={2}
              disabled={isReadOnly}
            />
          </div>
      </FormSection>

      <FormSection
        title="Featured Image"
        description={
          isReadOnly
            ? "Product featured image"
            : mode === "edit"
            ? "Update product image (leave empty to keep current image)"
            : "Image will be uploaded when you save the product"
        }
      >
          {isReadOnly && initialData?.featuredImage ? (
            <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={initialData.featuredImage}
                alt={typeof initialData.name === "string" ? initialData.name : initialData.name?.en || "Product"}
                className="object-cover w-full h-full"
              />
            </div>
          ) : !isReadOnly ? (
            <SingleImageUpload
              ref={featuredImageRef}
              onFileSelect={setFeaturedImageFile}
              initialUrl={initialData?.featuredImage}
            />
          ) : (
            <div className="text-sm text-muted-foreground">No image</div>
          )}
      </FormSection>

      <FormSection
        title="Pricing"
        description={
          options.length > 0
            ? "Base price - variants can have different prices"
            : "Set product pricing"
        }
      >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare at Price</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    compareAtPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="MNT">MNT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
      </FormSection>

      {/* Variants */}
      <VariantBuilder
        options={options}
        variants={variants}
        basePrice={formData.price}
        language={language}
        onOptionsChange={setOptions}
        onVariantsChange={setVariants}
      />

      {/* Inventory - Only show if no variants */}
      {options.length === 0 && (
        <FormSection title="Inventory">
            <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Track Inventory</p>
                <p className="text-xs text-muted-foreground mt-0.5">Enable inventory tracking for this product</p>
              </div>
              <Switch
                id="trackInventory"
                checked={formData.trackInventory}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, trackInventory: checked }))
                }
              />
            </div>

            {formData.trackInventory && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inventory">Current Stock *</Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        inventory: parseInt(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minStock: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            )}
        </FormSection>
      )}

      <FormSection title="Product Settings">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: value === "none" ? "" : value,
                }))
              }
              disabled={isReadOnly}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {typeof cat.name === "string" ? cat.name : cat.name?.en || cat.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Featured Product</p>
              <p className="text-xs text-muted-foreground mt-0.5">Display this product on the homepage</p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isFeatured: checked }))
              }
            />
          </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {mode === "create" ? "Create Product" : "Update Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
