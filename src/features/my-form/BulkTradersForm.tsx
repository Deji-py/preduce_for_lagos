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
import { useSubmitBulkTraderForm } from "@/hooks/useBulkTraderForm";
import { useQueryClient } from "@tanstack/react-query";

// Define the Zod schema for form validation
const bulkTradersSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  businessEntity: z.enum(
    [
      "Sole Proprietorship",
      "Partnership",
      "Limited Liability Company",
      "Cooperative",
    ],
    {
      message: "Please select a business entity type",
    }
  ),
  yearEstablished: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year (e.g., 2020)"),
  businessAddress: z.string().min(1, "Business Address is required"),
  emailAddress: z.string().email("Enter a valid email address"),
  phoneNumbers: z.string().min(1, "Phone Number is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  registrationNumber: z.string().min(1, "Registration Number is required"),
  contactFullName: z.string().min(1, "Full Name is required"),
  contactPosition: z.string().min(1, "Position/Title is required"),
  contactPhoneNumber: z.string().min(1, "Phone Number is required"),
  contactEmailAddress: z.string().email("Enter a valid email address"),
  primaryCommodities: z
    .string()
    .min(1, "Primary Commodities Traded are required"),
  monthlyTradeVolume: z
    .string()
    .min(1, "Average Monthly Trade Volume is required"),
  pointsOfOrigin: z.string().min(1, "Main Points of Origin are required"),
  distributionChannels: z
    .string()
    .min(1, "Main Distribution Channels are required"),
  transportVehicles: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  storageFacilities: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  storageCapacity: z.string().optional(),
  tradingHubs: z.string().min(1, "Main Trading Hubs or Locations are required"),
  programmeParticipation: z
    .string()
    .min(1, "Programme participation details are required"),
  supportRequired: z.string().min(1, "Support required details are required"),
});

// Define TypeScript type inferred from the schema
type BulkTradersFormData = z.infer<typeof bulkTradersSchema>;

export { bulkTradersSchema, type BulkTradersFormData };

export default function BulkTradersForm() {
  const submitBulkTraderForm = useSubmitBulkTraderForm();
  const queryClient = useQueryClient();

  // Initialize React Hook Form with Zod resolver
  const form = useForm<BulkTradersFormData>({
    resolver: zodResolver(bulkTradersSchema),
    defaultValues: {
      businessName: "",
      businessEntity: undefined,
      yearEstablished: "",
      businessAddress: "",
      emailAddress: "",
      phoneNumbers: "",
      website: "",
      registrationNumber: "",
      contactFullName: "",
      contactPosition: "",
      contactPhoneNumber: "",
      contactEmailAddress: "",
      primaryCommodities: "",
      monthlyTradeVolume: "",
      pointsOfOrigin: "",
      distributionChannels: "",
      transportVehicles: undefined,
      storageFacilities: undefined,
      storageCapacity: "",
      tradingHubs: "",
      programmeParticipation: "",
      supportRequired: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: BulkTradersFormData) => {
    try {
      await submitBulkTraderForm.mutateAsync(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Bulk Traders Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Details Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Business Details</h2>
            <div className="space-y-4">
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
                name="businessEntity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Business Entity</FormLabel>
                    <div className="space-y-2">
                      {[
                        "Sole Proprietorship",
                        "Partnership",
                        "Limited Liability Company",
                        "Cooperative",
                      ].map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="businessEntity"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === option}
                                  onCheckedChange={() => field.onChange(option)}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business address" {...field} />
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
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Registration Number (CAC or Trade License)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter registration number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Contact Person Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Contact Person</h2>
            <div className="space-y-4">
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
                name="contactPosition"
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
            </div>
          </Card>

          {/* Trading Operations Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Trading Operations</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="primaryCommodities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Commodities Traded</FormLabel>
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
                name="monthlyTradeVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Average Monthly Trade Volume (in tons or units)
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
                name="pointsOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Points of Origin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where produce is sourced"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Distribution Channels</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., markets, retailers, processors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Logistics & Infrastructure Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Logistics & Infrastructure</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="transportVehicles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you own or lease transport vehicles?
                    </FormLabel>
                    <div className="space-y-2">
                      {["Yes", "No"].map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="transportVehicles"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === option}
                                  onCheckedChange={() => field.onChange(option)}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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
                name="storageFacilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cold Chain or Storage Facilities</FormLabel>
                    <div className="space-y-2">
                      {["Yes", "No"].map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="storageFacilities"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === option}
                                  onCheckedChange={() => field.onChange(option)}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option}
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
                name="storageCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>If Yes, specify capacity/type</FormLabel>
                    <FormControl>
                      <Input placeholder="Specify capacity/type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradingHubs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Main Trading Hubs or Locations in Lagos State
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter trading hubs/locations"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Programme Engagement Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Programme Engagement</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="programmeParticipation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      How do you intend to participate in Produce for Lagos?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., bulk supply coordination, market insights, pricing data"
                        className="min-h-[100px] resize-none"
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
                        placeholder="e.g., access to aggregators, digital tools, market information"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={submitBulkTraderForm.isPending}
          >
            {submitBulkTraderForm.isPending ? (
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
