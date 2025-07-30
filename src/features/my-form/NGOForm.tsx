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
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import { useSubmitNGOForm } from "@/hooks/useSubmitNGOForm";
import { useQueryClient } from "@tanstack/react-query";

// Define the Zod schema for form validation
const ngoSchema = z.object({
  organizationName: z.string().min(1, "Organization Name is required"),
  type: z
    .array(
      z.enum([
        "NGO",
        "International Development Partner",
        "Foundation",
        "Advocacy Group",
        "Research Institution",
        "Other",
      ])
    )
    .min(1, "Select at least one type"),
  typeOther: z.string().optional(),
  yearEstablished: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year (e.g., 2020)"),
  headOfficeAddress: z.string().min(1, "Head Office Address is required"),
  emailAddress: z.string().email("Enter a valid email address"),
  phoneNumbers: z.string().min(1, "Phone Number is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  socialMediaHandles: z.string().optional(),
  contactFullName: z.string().min(1, "Full Name is required"),
  contactDesignation: z.string().min(1, "Designation is required"),
  contactPhoneNumber: z.string().min(1, "Phone Number is required"),
  contactEmailAddress: z.string().email("Enter a valid email address"),
  alternateContact: z.string().optional(),
  focusAreas: z
    .array(
      z.enum([
        "Food Security & Nutrition",
        "Agricultural Development",
        "Rural Livelihoods",
        "Climate Adaptation",
        "Women & Youth Empowerment",
        "Monitoring & Evaluation",
        "Research & Policy Advocacy",
        "Training & Capacity Building",
        "Supply Chain & Logistics",
        "Access to Finance",
        "Other",
      ])
    )
    .min(1, "Select at least one focus area"),
  focusAreasOther: z.string().optional(),
  pastProjects: z
    .string()
    .min(1, "Past projects description is required")
    .max(200, "Description must not exceed 200 words"),
  ongoingProjects: z
    .string()
    .min(1, "Ongoing projects description is required"),
  collaboratingAgencies: z
    .string()
    .min(1, "Collaborating agencies are required"),
  engagement: z
    .array(
      z.enum([
        "technical support",
        "funding",
        "research",
        "community mobilization",
        "capacity building",
      ])
    )
    .min(1, "Select at least one engagement type"),
  resources: z
    .array(
      z.enum([
        "Human Resources",
        "Funding",
        "Tools/Assets",
        "Knowledge Products",
        "Other",
      ])
    )
    .min(1, "Select at least one resource type"),
  resourcesOther: z.string().optional(),
  supportRequired: z
    .array(
      z.enum([
        "coordination support",
        "data access",
        "public sector liaison",
        "promotional support",
      ])
    )
    .min(1, "Select at least one support type"),
});

// Define TypeScript type inferred from the schema
type NGOFormData = z.infer<typeof ngoSchema>;

export { ngoSchema, type NGOFormData };

export default function NGOsForm() {
  const submitNGOForm = useSubmitNGOForm(); // Initialize the new hook
  const queryClient = useQueryClient();
  // Initialize React Hook Form with Zod resolver
  const form = useForm<NGOFormData>({
    resolver: zodResolver(ngoSchema),
    defaultValues: {
      organizationName: "",
      type: [],
      typeOther: "",
      yearEstablished: "",
      headOfficeAddress: "",
      emailAddress: "",
      phoneNumbers: "",
      website: "",
      socialMediaHandles: "",
      contactFullName: "",
      contactDesignation: "",
      contactPhoneNumber: "",
      contactEmailAddress: "",
      alternateContact: "",
      focusAreas: [],
      focusAreasOther: "",
      pastProjects: "",
      ongoingProjects: "",
      collaboratingAgencies: "",
      engagement: [],
      resources: [],
      resourcesOther: "",
      supportRequired: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: NGOFormData) => {
    try {
      await submitNGOForm.mutateAsync(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">NGOs Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Organization Information Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Organization Information</h2>
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={() => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="space-y-2">
                    {[
                      "NGO",
                      "International Development Partner",
                      "Foundation",
                      "Advocacy Group",
                      "Research Institution",
                      "Other",
                    ].map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), type]
                                    : (field.value || []).filter(
                                        (val: string) => val !== type
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {type}
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
              name="typeOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If Other, please specify</FormLabel>
                  <FormControl>
                    <Input placeholder="Specify other type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearEstablished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Established</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headOfficeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Office Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter head office address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number(s)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialMediaHandles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Media Handles (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter social media handles"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Contact Person Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Contact Person</h2>
            <FormField
              control={form.control}
              name="contactFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Contact (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter alternate contact details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Focus Areas & Expertise Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Focus Areas & Expertise</h2>
            <FormField
              control={form.control}
              name="focusAreas"
              render={() => (
                <FormItem>
                  <FormLabel>Select applicable thematic focus areas</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Food Security & Nutrition",
                      "Agricultural Development",
                      "Rural Livelihoods",
                      "Climate Adaptation",
                      "Women & Youth Empowerment",
                      "Monitoring & Evaluation",
                      "Research & Policy Advocacy",
                      "Training & Capacity Building",
                      "Supply Chain & Logistics",
                      "Access to Finance",
                      "Other",
                    ].map((area) => (
                      <FormField
                        key={area}
                        control={form.control}
                        name="focusAreas"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(area as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), area]
                                    : (field.value || []).filter(
                                        (val: string) => val !== area
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {area}
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
              name="focusAreasOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If Other, please specify</FormLabel>
                  <FormControl>
                    <Input placeholder="Specify other focus areas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Programme Experience Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Programme Experience</h2>
            <FormField
              control={form.control}
              name="pastProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Briefly describe relevant past projects or interventions in
                    the agriculture or food systems space (max 200 words)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe past projects" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ongoingProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    List current ongoing projects in Lagos or other states (if
                    any)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe ongoing projects"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collaboratingAgencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mention collaborating agencies or stakeholders
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List collaborating agencies"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Proposed Engagement with Produce for Lagos Programme Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">
              Proposed Engagement with Produce for Lagos Programme
            </h2>
            <FormField
              control={form.control}
              name="engagement"
              render={() => (
                <FormItem>
                  <FormLabel>
                    How does your organization intend to engage with the
                    programme?
                  </FormLabel>
                  <div className="space-y-2">
                    {[
                      "technical support",
                      "funding",
                      "research",
                      "community mobilization",
                      "capacity building",
                    ].map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="engagement"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), type]
                                    : (field.value || []).filter(
                                        (val: string) => val !== type
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {type}
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
              name="resources"
              render={() => (
                <FormItem>
                  <FormLabel>Resources available for partnership</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Human Resources",
                      "Funding",
                      "Tools/Assets",
                      "Knowledge Products",
                      "Other",
                    ].map((resource) => (
                      <FormField
                        key={resource}
                        control={form.control}
                        name="resources"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(resource as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), resource]
                                    : (field.value || []).filter(
                                        (val: string) => val !== resource
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {resource}
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
              name="resourcesOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>If Other, please specify</FormLabel>
                  <FormControl>
                    <Input placeholder="Specify other resources" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportRequired"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Support required from the Programme Team
                  </FormLabel>
                  <div className="space-y-2">
                    {[
                      "coordination support",
                      "data access",
                      "public sector liaison",
                      "promotional support",
                    ].map((support) => (
                      <FormField
                        key={support}
                        control={form.control}
                        name="supportRequired"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(support as any)}
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
                    ))}
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
            disabled={submitNGOForm.isPending}
          >
            {submitNGOForm.isPending ? (
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
