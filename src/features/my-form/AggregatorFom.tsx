"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSubmitAggregatorForm } from "@/hooks/useSubmitAggregatorForm";
import { useQueryClient } from "@tanstack/react-query";

// Define the Zod schema for form validation
const aggregatorsSchema = z.object({
  businessName: z.string().min(1, "Company/Business Name is required"),
  contactPerson: z.string().min(1, "Contact Person Name & Role is required"),
  primaryCommodities: z
    .string()
    .min(1, "Primary Commodities Aggregated are required"),
  operationalRegions: z.string().min(1, "Operational Regions are required"),
  monthlyAggregationVolume: z
    .string()
    .min(1, "Average Monthly Aggregation Volume is required"),
  collectionPoints: z
    .string()
    .min(1, "Collection Points & Infrastructure are required"),
  storageFacilities: z
    .string()
    .min(1, "Storage Facilities Owned/Accessed are required"),
  farmerRelationships: z
    .string()
    .min(1, "Relationships with Farmers or Cooperatives are required"),
  logisticsPartners: z.string().optional(),
  sectorsInterested: z
    .array(z.enum(["Export", "Processing", "Retail"]))
    .min(1, "Select at least one sector"),
  supportNeeded: z
    .array(z.enum(["Financing", "Infrastructure", "Digital Tools"]))
    .min(1, "Select at least one support type"),
});

// Define TypeScript type inferred from the schema
type AggregatorsFormData = z.infer<typeof aggregatorsSchema>;

export { aggregatorsSchema, type AggregatorsFormData };

export default function AggregatorsForm() {
  const submitAggregatorForm = useSubmitAggregatorForm(); // Initialize the new hook
  const queryClient = useQueryClient();
  // Initialize React Hook Form with Zod resolver
  const form = useForm<AggregatorsFormData>({
    resolver: zodResolver(aggregatorsSchema),
    defaultValues: {
      businessName: "",
      contactPerson: "",
      primaryCommodities: "",
      operationalRegions: "",
      monthlyAggregationVolume: "",
      collectionPoints: "",
      storageFacilities: "",
      farmerRelationships: "",
      logisticsPartners: "",
      sectorsInterested: [],
      supportNeeded: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: AggregatorsFormData) => {
    try {
      await submitAggregatorForm.mutateAsync(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Aggregators Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Overview Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Business Overview</h2>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company/business name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name & Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name and role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryCommodities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Commodities Aggregated</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., tomatoes, rice, plantain"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operationalRegions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operational Regions</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter operational regions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Capacity & Operations Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Capacity & Operations</h2>
            <FormField
              control={form.control}
              name="monthlyAggregationVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Average Monthly Aggregation Volume (in tons or units)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter volume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectionPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Points & Infrastructure</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe collection points and infrastructure"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storageFacilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Facilities Owned/Accessed</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe storage facilities"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="farmerRelationships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Relationships with Farmers or Cooperatives
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe relationships" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logisticsPartners"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logistics Partners Used (if any)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify logistics partners"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Collaboration Interests Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Collaboration Interests</h2>
            <FormField
              control={form.control}
              name="sectorsInterested"
              render={() => (
                <FormItem>
                  <FormLabel>Sectors Interested In</FormLabel>
                  <div className="space-y-2">
                    {["Export", "Processing", "Retail"].map((sector) => (
                      <FormField
                        key={sector}
                        control={form.control}
                        name="sectorsInterested"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(sector as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), sector]
                                    : (field.value || []).filter(
                                        (val: string) => val !== sector
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {sector}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportNeeded"
              render={() => (
                <FormItem>
                  <FormLabel>Type of Support Needed</FormLabel>
                  <div className="space-y-2">
                    {["Financing", "Infrastructure", "Digital Tools"].map(
                      (support) => (
                        <FormField
                          key={support}
                          control={form.control}
                          name="supportNeeded"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    support as any
                                  )}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), support]
                                      : (field.value || []).filter(
                                          (val: string) => val !== support
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {support}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={submitAggregatorForm.isPending}
          >
            {submitAggregatorForm.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
