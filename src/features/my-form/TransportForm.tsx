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
import { useSubmitTransportCompanyForm } from "@/hooks/useSubmitTransportCompanyForm";

// Define the Zod schema for form validation
const transportCompanySchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person & Role is required"),
  fleetSizeRefrigerated: z
    .string()
    .regex(/^\d+$/, "Enter a valid number")
    .optional()
    .or(z.literal("")),
  fleetSizeFlatbed: z
    .string()
    .regex(/^\d+$/, "Enter a valid number")
    .optional()
    .or(z.literal("")),
  fleetSizeVans: z
    .string()
    .regex(/^\d+$/, "Enter a valid number")
    .optional()
    .or(z.literal("")),
  regionsOfService: z.string().min(1, "Regions of Service are required"),
  vehicleOwnership: z
    .array(z.enum(["Owned", "Leased"]))
    .min(1, "Select at least one ownership type"),
  commoditiesTransported: z
    .string()
    .min(1, "Typical Commodities Transported are required"),
  volumeCapacity: z.string().min(1, "Volume Capacity per Vehicle is required"),
  coldChainCapabilities: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  warehousingPoints: z
    .string()
    .min(1, "Warehousing or Cross-Docking Points are required"),
});

// Define TypeScript type inferred from the schema
type TransportCompanyFormData = z.infer<typeof transportCompanySchema>;

export { transportCompanySchema, type TransportCompanyFormData };

export default function TransportCompanyForm() {
  const submitTransportCompanyForm = useSubmitTransportCompanyForm(); // Initialize the new hook

  // Initialize React Hook Form with Zod resolver
  const form = useForm<TransportCompanyFormData>({
    resolver: zodResolver(transportCompanySchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      fleetSizeRefrigerated: "",
      fleetSizeFlatbed: "",
      fleetSizeVans: "",
      regionsOfService: "",
      vehicleOwnership: [],
      commoditiesTransported: "",
      volumeCapacity: "",
      coldChainCapabilities: undefined,
      warehousingPoints: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: TransportCompanyFormData) => {
    try {
      await submitTransportCompanyForm.mutateAsync(data);
      form.reset();
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">
          Transport Company Form
        </h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Profile Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Company Profile</h2>
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
                  <FormLabel>Contact Person & Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact person and role"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fleetSizeRefrigerated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet Size: Refrigerated</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Number of refrigerated vehicles"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fleetSizeFlatbed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet Size: Flatbed</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Number of flatbed vehicles"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fleetSizeVans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fleet Size: Vans</FormLabel>
                  <FormControl>
                    <Input placeholder="Number of vans" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionsOfService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regions of Service</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter regions of service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Logistics Infrastructure Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Logistics Infrastructure</h2>
            <FormField
              control={form.control}
              name="vehicleOwnership"
              render={() => (
                <FormItem>
                  <FormLabel>Ownership of Vehicles</FormLabel>
                  <div className="space-y-2">
                    {["Owned", "Leased"].map((ownership) => (
                      <FormField
                        key={ownership}
                        control={form.control}
                        name="vehicleOwnership"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  ownership as any
                                )}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), ownership]
                                    : (field.value || []).filter(
                                        (val: string) => val !== ownership
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {ownership}
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
              name="commoditiesTransported"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Commodities Transported</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter commodities transported"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volumeCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume Capacity per Vehicle</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter volume capacity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coldChainCapabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cold Chain Capabilities</FormLabel>
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
              name="warehousingPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Warehousing or Cross-Docking Points Available
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe warehousing or cross-docking points"
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
            disabled={submitTransportCompanyForm.isPending}
          >
            {submitTransportCompanyForm.isPending ? (
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
