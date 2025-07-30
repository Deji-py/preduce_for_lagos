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

import { Loader2 } from "lucide-react";
import { useSubmitFarmerForm } from "@/hooks/useFarmerForm";
import { useQueryClient } from "@tanstack/react-query";

// Define the Zod schema for form validation
const farmersSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  contactInformation: z.string().min(1, "Contact Information is required"),
  farmLocations: z.string().min(1, "Farm Locations are required"),
  farmSize: z.string().min(1, "Farm Size is required"),
  farmingType: z
    .array(z.enum(["Crop", "Livestock", "Mixed"]))
    .min(1, "Select at least one farming type"),
  mainCrops: z.string().min(1, "Main Crops/Produce are required"),
  seasonalCalendar: z.string().min(1, "Seasonal Calendar is required"),
  monthlyOutput: z.string().min(1, "Average Monthly Output is required"),
  irrigationMethods: z.string().optional(),
  postHarvestFacilities: z.string().optional(),
  cooperativeMember: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  extensionService: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
});

// Define TypeScript type inferred from the schema
type FarmersFormData = z.infer<typeof farmersSchema>;

export { farmersSchema, type FarmersFormData };

export default function FarmersForm() {
  const submitFarmerForm = useSubmitFarmerForm();
  const queryClient = useQueryClient();

  // Initialize React Hook Form with Zod resolver
  const form = useForm<FarmersFormData>({
    resolver: zodResolver(farmersSchema),
    defaultValues: {
      fullName: "",
      contactInformation: "",
      farmLocations: "",
      farmSize: "",
      farmingType: [],
      mainCrops: "",
      seasonalCalendar: "",
      monthlyOutput: "",
      irrigationMethods: "",
      postHarvestFacilities: "",
      cooperativeMember: undefined,
      extensionService: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FarmersFormData) => {
    try {
      await submitFarmerForm.mutateAsync(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Farmer Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal & Farm Details Section */}
          <Card className="p-4 ">
            <h2 className="text-lg font-medium ">Personal & Farm Details</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
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
                name="contactInformation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number and/or email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Locations (LGA/State)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter farm locations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Size (in hectares or acres)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter farm size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmingType"
                render={() => (
                  <FormItem>
                    <FormLabel>Type of Farming</FormLabel>
                    <div className="space-y-2">
                      {["Crop", "Livestock", "Mixed"].map((type) => (
                        <FormField
                          key={type}
                          control={form.control}
                          name="farmingType"
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
            </div>
          </Card>

          {/* Production Information Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Production Information</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mainCrops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Crops/Produce</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., yam, cassava, poultry"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seasonalCalendar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Seasonal Calendar (Harvest cycles per year)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter harvesting periods"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyOutput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Monthly Output (Volume)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter monthly output" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="irrigationMethods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Irrigation Methods Used (if any)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Specify irrigation methods"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postHarvestFacilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post-Harvest Facilities Available</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Specify storage or processing facilities"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Network & Support Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium ">Network & Support</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cooperativeMember"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Are you a member of any Farmer's Cooperative or
                      Association?
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
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="extensionService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you have access to any form of extension service?
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
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
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
            disabled={submitFarmerForm.isPending}
          >
            {submitFarmerForm.isPending ? (
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
