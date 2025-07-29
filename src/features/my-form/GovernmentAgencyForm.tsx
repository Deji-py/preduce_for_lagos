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
import { useSubmitGovernmentAgencyForm } from "@/hooks/useSubmitGovernmentAgencyForm";

// Define the Zod schema for form validation
const governmentAgenciesSchema = z.object({
  agencyName: z.string().min(1, "Agency Name is required"),
  mandate: z.string().min(1, "Mandate/Primary Function is required"),
  department: z.string().min(1, "Department/Unit Participating is required"),
  contactAddress: z.string().min(1, "Contact Address is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  emailAddress: z.string().email("Enter a valid email address"),
  phoneNumbers: z.string().min(1, "Phone Number is required"),
  focalPersonName: z.string().min(1, "Full Name is required"),
  focalPersonPosition: z.string().min(1, "Position/Title is required"),
  focalPersonPhone: z.string().min(1, "Phone Number is required"),
  focalPersonEmail: z.string().email("Enter a valid email address"),
  alternateContact: z.string().optional(),
  geographicCoverage: z
    .array(z.enum(["Statewide", "Regional", "Local Government Areas"]))
    .min(1, "Select at least one geographic coverage"),
  involvement: z
    .array(
      z.enum([
        "Policy Development",
        "Extension Services",
        "Monitoring & Evaluation",
        "Financing/Subsidies",
        "Infrastructure & Facilities",
        "Safety & Regulation",
        "Others",
      ])
    )
    .min(1, "Select at least one involvement type"),
  involvementOthers: z.string().optional(),
  ongoingInitiatives: z
    .string()
    .min(1, "Ongoing agricultural initiatives are required"),
  partnerships: z.string().min(1, "Partnerships are required"),
  contributionPlan: z.string().min(1, "Contribution plan is required"),
  supportRequired: z.string().min(1, "Support required is required"),
});

// Define TypeScript type inferred from the schema
type GovernmentAgenciesFormData = z.infer<typeof governmentAgenciesSchema>;

export { governmentAgenciesSchema, type GovernmentAgenciesFormData };

export default function GovernmentAgenciesForm() {
  const submitGovernmentAgencyForm = useSubmitGovernmentAgencyForm(); // Initialize the new hook

  // Initialize React Hook Form with Zod resolver
  const form = useForm<GovernmentAgenciesFormData>({
    resolver: zodResolver(governmentAgenciesSchema),
    defaultValues: {
      agencyName: "",
      mandate: "",
      department: "",
      contactAddress: "",
      website: "",
      emailAddress: "",
      phoneNumbers: "",
      focalPersonName: "",
      focalPersonPosition: "",
      focalPersonPhone: "",
      focalPersonEmail: "",
      alternateContact: "",
      geographicCoverage: [],
      involvement: [],
      involvementOthers: "",
      ongoingInitiatives: "",
      partnerships: "",
      contributionPlan: "",
      supportRequired: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: GovernmentAgenciesFormData) => {
    try {
      await submitGovernmentAgencyForm.mutateAsync(data);
      form.reset();
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">
          Government Agencies Form
        </h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Agency Profile Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Agency Profile</h2>
            <FormField
              control={form.control}
              name="agencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mandate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mandate/Primary Function</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe mandate or primary function"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department/Unit Participating</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department/unit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact address" {...field} />
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
                  <FormLabel>Website (if available)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter website URL" {...field} />
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
          </Card>
          {/* Designated Focal Person Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Designated Focal Person</h2>
            <FormField
              control={form.control}
              name="focalPersonName"
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
              name="focalPersonPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter position/title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="focalPersonPhone"
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
              name="focalPersonEmail"
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
          {/* Operational Scope Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Operational Scope</h2>
            <FormField
              control={form.control}
              name="geographicCoverage"
              render={() => (
                <FormItem>
                  <FormLabel>Geographic Coverage</FormLabel>
                  <div className="space-y-2">
                    {["Statewide", "Regional", "Local Government Areas"].map(
                      (coverage) => (
                        <FormField
                          key={coverage}
                          control={form.control}
                          name="geographicCoverage"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    coverage as any
                                  )}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), coverage]
                                      : (field.value || []).filter(
                                          (val: string) => val !== coverage
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {coverage}
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
            <FormField
              control={form.control}
              name="involvement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Current Involvement in Agricultural Value Chain
                  </FormLabel>
                  <div className="space-y-2">
                    {[
                      "Policy Development",
                      "Extension Services",
                      "Monitoring & Evaluation",
                      "Financing/Subsidies",
                      "Infrastructure & Facilities",
                      "Safety & Regulation",
                      "Others",
                    ].map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="involvement"
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
              name="involvementOthers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Others (please specify)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify other involvement types"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Existing Programmes & Collaborations Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">
              Existing Programmes & Collaborations
            </h2>
            <FormField
              control={form.control}
              name="ongoingInitiatives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    List any ongoing agricultural initiatives your agency is
                    coordinating or supporting
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe ongoing initiatives"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partnerships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mention partnerships with other MDAs, private sector, or
                    NGOs (if any)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe partnerships" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Alignment with Produce for Lagos Programme Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">
              Alignment with Produce for Lagos Programme
            </h2>
            <FormField
              control={form.control}
              name="contributionPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How does your agency plan to contribute to the programme?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., policy support, technical assistance, funding"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Support required from the Produce for Lagos Team
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., data sharing, project alignment, training"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={submitGovernmentAgencyForm.isPending}
          >
            {submitGovernmentAgencyForm.isPending ? (
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
