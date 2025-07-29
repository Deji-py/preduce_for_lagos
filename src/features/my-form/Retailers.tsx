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
import { useSubmitRetailerForm } from "@/hooks/useSubmitRetailerForm";

// Define the Zod schema for form validation
const retailersSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  retailOperationType: z
    .array(
      z.enum(["Market Stall", "Shop", "Supermarket", "Ecommerce", "Other"])
    )
    .min(1, "Select at least one retail operation type"),
  retailOperationTypeOther: z.string().optional(),
  yearEstablished: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year (e.g., 2020)"),
  storeAddresses: z.string().min(1, "Store Address(es) is required"),
  emailAddress: z.string().email("Enter a valid email address"),
  phoneNumbers: z.string().min(1, "Phone Number is required"),
  businessRegistrationNumber: z.string().optional(),
  ownerFullName: z.string().min(1, "Full Name is required"),
  ownerPosition: z.string().min(1, "Position is required"),
  ownerPhoneNumber: z.string().min(1, "Phone Number is required"),
  ownerEmailAddress: z.string().email("Enter a valid email address"),
  commoditiesSold: z.string().min(1, "Commodities Typically Sold are required"),
  dailySalesVolume: z.string().min(1, "Average Daily Sales Volume is required"),
  primarySuppliers: z.string().min(1, "Primary Suppliers are required"),
  customerBase: z
    .array(z.enum(["Residential", "Commercial", "Institutional", "Mixed"]))
    .min(1, "Select at least one customer base"),
  paymentMethods: z
    .array(z.enum(["Cash", "Bank Transfer", "POS", "Digital Wallets"]))
    .min(1, "Select at least one payment method"),
  programmeGoals: z
    .string()
    .min(1, "Goals for Joining the Programme are required"),
  supportNeeded: z
    .string()
    .min(1, "Support Needed from Programme Team is required"),
});

// Define TypeScript type inferred from the schema
type RetailersFormData = z.infer<typeof retailersSchema>;

export { retailersSchema, type RetailersFormData };

export default function RetailersForm() {
  const submitRetailerForm = useSubmitRetailerForm(); // Initialize the new hook

  // Initialize React Hook Form with Zod resolver
  const form = useForm<RetailersFormData>({
    resolver: zodResolver(retailersSchema),
    defaultValues: {
      businessName: "",
      retailOperationType: [],
      retailOperationTypeOther: "",
      yearEstablished: "",
      storeAddresses: "",
      emailAddress: "",
      phoneNumbers: "",
      businessRegistrationNumber: "",
      ownerFullName: "",
      ownerPosition: "",
      ownerPhoneNumber: "",
      ownerEmailAddress: "",
      commoditiesSold: "",
      dailySalesVolume: "",
      primarySuppliers: "",
      customerBase: [],
      paymentMethods: [],
      programmeGoals: "",
      supportNeeded: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: RetailersFormData) => {
    try {
      await submitRetailerForm.mutateAsync(data);
      form.reset();
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Retailers Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Retail Profile Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Retail Profile</h2>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retailOperationType"
              render={() => (
                <FormItem>
                  <FormLabel>Type of Retail Operation</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Market Stall",
                      "Shop",
                      "Supermarket",
                      "Ecommerce",
                      "Other",
                    ].map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="retailOperationType"
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
              name="retailOperationTypeOther"
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
              name="storeAddresses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address(es)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter store address(es)" {...field} />
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
              name="businessRegistrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Registration Number (if any)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Owner/Manager Information Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Owner/Manager Information</h2>
            <FormField
              control={form.control}
              name="ownerFullName"
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
              name="ownerPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerEmailAddress"
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
          </Card>
          {/* Retail Operations Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Retail Operations</h2>
            <FormField
              control={form.control}
              name="commoditiesSold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commodities Typically Sold</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., vegetables, grains, oils"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dailySalesVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Average Daily Sales Volume (units or Naira value)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sales volume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primarySuppliers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Suppliers</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., aggregators, open markets"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerBase"
              render={() => (
                <FormItem>
                  <FormLabel>Customer Base</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Residential",
                      "Commercial",
                      "Institutional",
                      "Mixed",
                    ].map((base) => (
                      <FormField
                        key={base}
                        control={form.control}
                        name="customerBase"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(base as any)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), base]
                                    : (field.value || []).filter(
                                        (val: string) => val !== base
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {base}
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
              name="paymentMethods"
              render={() => (
                <FormItem>
                  <FormLabel>Preferred Payment Methods</FormLabel>
                  <div className="space-y-2">
                    {["Cash", "Bank Transfer", "POS", "Digital Wallets"].map(
                      (method) => (
                        <FormField
                          key={method}
                          control={form.control}
                          name="paymentMethods"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(method as any)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), method]
                                      : (field.value || []).filter(
                                          (val: string) => val !== method
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {method}
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
          {/* Engagement with Produce for Lagos Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">
              Engagement with Produce for Lagos
            </h2>
            <FormField
              control={form.control}
              name="programmeGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goals for Joining the Programme</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., reliable supply, better margins, partnerships"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Needed from Programme Team</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., training, supplier linkages, market intelligence"
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
            disabled={submitRetailerForm.isPending}
          >
            {submitRetailerForm.isPending ? (
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
