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
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Import Loader2 icon
import { useSubmitInputSupplierForm } from "@/hooks/useSubmitInputSupplierForm";
// Updated import path

// Define the Zod schema for form validation
const inputSupplierSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  inputsSupplied: z.string().min(1, "Type of Inputs Supplied is required"),
  regionsOfDistribution: z
    .string()
    .min(1, "Regions of Distribution are required"),
  salesVolume: z.string().min(1, "Sales Volume per Month is required"),
  distributionChannels: z
    .array(z.enum(["Retail", "Wholesale", "Direct to Farms"]))
    .min(1, "Select at least one distribution channel"),
  partnerships: z.enum(["Yes", "No"], { message: "Please select an option" }),
  trainingFarmers: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  bulkPackages: z.enum(["Yes", "No"], { message: "Please select an option" }),
});

// Define TypeScript type inferred from the schema
type InputSupplierFormData = z.infer<typeof inputSupplierSchema>;

export { inputSupplierSchema, type InputSupplierFormData };

export default function InputSupplierForm() {
  const submitInputSupplierForm = useSubmitInputSupplierForm(); // Initialize the new hook

  // Initialize React Hook Form with Zod resolver
  const form = useForm<InputSupplierFormData>({
    resolver: zodResolver(inputSupplierSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      inputsSupplied: "",
      regionsOfDistribution: "",
      salesVolume: "",
      distributionChannels: [],
      partnerships: undefined,
      trainingFarmers: undefined,
      bulkPackages: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (data: InputSupplierFormData) => {
    try {
      await submitInputSupplierForm.mutateAsync(data);
      form.reset();
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Input Supplier Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Details Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Business Details</h2>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
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
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name and role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputsSupplied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Inputs Supplied</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., fertilizers, seeds, pesticides"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionsOfDistribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regions of Distribution</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter distribution regions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Distribution Information Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Distribution Information</h2>
            <FormField
              control={form.control}
              name="salesVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Volume per Month</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter monthly sales volume"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distributionChannels"
              render={() => (
                <FormItem>
                  <FormLabel>Distribution Channels</FormLabel>
                  <div className="space-y-2">
                    {["Retail", "Wholesale", "Direct to Farms"].map(
                      (channel) => (
                        <FormField
                          key={channel}
                          control={form.control}
                          name="distributionChannels"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    channel as any
                                  )}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), channel]
                                      : (field.value || []).filter(
                                          (val: string) => val !== channel
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {channel}
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
              name="partnerships"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Partnerships with Cooperatives or Extension Agents
                  </FormLabel>
                  <div className="space-y-2">
                    {["Yes", "No"].map((option) => (
                      <FormItem
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === option}
                            onCheckedChange={() => field.onChange(option)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Support Opportunities Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Support Opportunities</h2>
            <FormField
              control={form.control}
              name="trainingFarmers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interested in Training Farmers</FormLabel>
                  <div className="space-y-2">
                    {["Yes", "No"].map((option) => (
                      <FormItem
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === option}
                            onCheckedChange={() => field.onChange(option)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bulkPackages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Open to Offering Bulk Input Packages via the Program
                  </FormLabel>
                  <div className="space-y-2">
                    {["Yes", "No"].map((option) => (
                      <FormItem
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === option}
                            onCheckedChange={() => field.onChange(option)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </FormItem>
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
            disabled={submitInputSupplierForm.isPending}
          >
            {submitInputSupplierForm.isPending ? (
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
