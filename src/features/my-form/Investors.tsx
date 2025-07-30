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
import { useSubmitInvestorForm } from "@/hooks/useSubmitInvestorForm";
import { useQueryClient } from "@tanstack/react-query";

// Define the Zod schema for form validation
const investorsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  contactDetails: z.string().min(1, "Email & Contact Details are required"),
  investmentFocus: z
    .array(z.enum(["Agriculture", "Logistics", "Processing", "Retail"]))
    .min(1, "Select at least one investment focus"),
  pastInvestmentExperience: z.enum(["Yes", "No"], {
    message: "Please select an option",
  }),
  preferredInstruments: z
    .array(z.enum(["Equity", "Debt", "Grants", "Blended Finance"]))
    .min(1, "Select at least one investment instrument"),
  investmentSizeRange: z.string().min(1, "Investment Size Range is required"),
  timeHorizon: z.string().min(1, "Time Horizon & Exit Strategy is required"),
  areasOfInterest: z
    .array(
      z.enum([
        "Infrastructure",
        "SPVs",
        "Expansion projects",
        "Farmer Financing",
      ])
    )
    .min(1, "Select at least one area of interest"),
  coInvestment: z.enum(["Yes", "No"], { message: "Please select an option" }),
  pitchForums: z.enum(["Yes", "No"], { message: "Please select an option" }),
});

// Define TypeScript type inferred from the schema
type InvestorsFormData = z.infer<typeof investorsSchema>;

export { investorsSchema, type InvestorsFormData };

export default function InvestorsForm() {
  const submitInvestorForm = useSubmitInvestorForm(); // Initialize the new hook
  const queryClient = useQueryClient();
  // Initialize React Hook Form with Zod resolver
  const form = useForm<InvestorsFormData>({
    resolver: zodResolver(investorsSchema),
    defaultValues: {
      name: "",
      company: "",
      contactDetails: "",
      investmentFocus: [],
      pastInvestmentExperience: undefined,
      preferredInstruments: [],
      investmentSizeRange: "",
      timeHorizon: "",
      areasOfInterest: [],
      coInvestment: undefined,
      pitchForums: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (data: InvestorsFormData) => {
    try {
      await submitInvestorForm.mutateAsync(data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-poppins">Investors Form</h1>
        <p className="text-sm opacity-80 mt-1">Enter Your Information Below</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Investor Details Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Investor Details</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (if applicable)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email & Contact Details</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email and/or phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investmentFocus"
              render={() => (
                <FormItem>
                  <FormLabel>Investment Focus</FormLabel>
                  <div className="space-y-2">
                    {["Agriculture", "Logistics", "Processing", "Retail"].map(
                      (focus) => (
                        <FormField
                          key={focus}
                          control={form.control}
                          name="investmentFocus"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(focus as any)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), focus]
                                      : (field.value || []).filter(
                                          (val: string) => val !== focus
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {focus}
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
              name="pastInvestmentExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Past Investment Experience in Agri-sector
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
          {/* Investment Criteria Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Investment Criteria</h2>
            <FormField
              control={form.control}
              name="preferredInstruments"
              render={() => (
                <FormItem>
                  <FormLabel>Preferred Investment Instruments</FormLabel>
                  <div className="space-y-2">
                    {["Equity", "Debt", "Grants", "Blended Finance"].map(
                      (instrument) => (
                        <FormField
                          key={instrument}
                          control={form.control}
                          name="preferredInstruments"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    instrument as any
                                  )}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...(field.value || []), instrument]
                                      : (field.value || []).filter(
                                          (val: string) => val !== instrument
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {instrument}
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
              name="investmentSizeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Size Range</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter investment size range"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeHorizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Horizon & Exit Strategy</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe time horizon and exit strategy"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          {/* Engagement Interests Section */}
          <Card className="p-4">
            <h2 className="text-lg font-medium">Engagement Interests</h2>
            <FormField
              control={form.control}
              name="areasOfInterest"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Areas of Interest in Produce for Lagos Programme
                  </FormLabel>
                  <div className="space-y-2">
                    {[
                      "Infrastructure",
                      "SPVs",
                      "Expansion projects",
                      "Farmer Financing",
                    ].map((area) => (
                      <FormField
                        key={area}
                        control={form.control}
                        name="areasOfInterest"
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
              name="coInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Interested in Co-investment or Syndicate Models?
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
            <FormField
              control={form.control}
              name="pitchForums"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Open to participating in investor pitch forums or briefings?
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
            disabled={submitInvestorForm.isPending}
          >
            {submitInvestorForm.isPending ? (
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
