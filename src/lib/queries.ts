import { supabaseClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  state: string | null;
  gender: string | null;
  company_name: string | null;
  designation: string | null;
  stakeholder_type: string | null;
  years_of_operation: string | null;
  business_description: string | null;
  password_reset: boolean;
  category: string | null;
  form_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmerData {
  id?: number;
  user_id: string;
  full_name: string;
  farm_name: string;
  farm_address: string;
  phone_numbers: string;
  email_address: string | null;
  farm_size: string;
  commodities_produced: string;
  farming_methods: string[];
  farming_methods_other: string | null;
  average_yield: string;
  market_channels: string[];
  market_channels_other: string | null;
  programme_goals: string;
  support_needed: string;
  created_at?: string;
}

export interface BulkTraderData {
  id?: number;
  user_id: string;
  business_name: string;
  business_entity: string;
  year_established: string;
  business_address: string;
  email_address: string;
  phone_numbers: string;
  website: string | null;
  registration_number: string;
  contact_full_name: string;
  contact_position: string;
  contact_phone_number: string;
  contact_email_address: string;
  primary_commodities: string;
  monthly_trade_volume: string;
  points_of_origin: string;
  distribution_channels: string;
  transport_vehicles: string;
  storage_facilities: string;
  storage_capacity: string | null;
  trading_hubs: string;
  programme_participation: string;
  support_required: string;
  created_at?: string;
}

export interface AggregatorData {
  id?: number;
  user_id: string;
  business_name: string;
  contact_person: string;
  primary_commodities: string;
  operational_regions: string;
  monthly_aggregation_volume: string;
  collection_points: string;
  storage_facilities: string;
  farmer_relationships: string;
  logistics_partners: string | null;
  sectors_interested: string[];
  support_needed: string[];
  created_at?: string;
}

export interface GovernmentAgencyData {
  id?: number;
  user_id: string;
  agency_name: string;
  mandate: string;
  department: string;
  contact_address: string;
  website: string | null;
  email_address: string;
  phone_numbers: string;
  focal_person_name: string;
  focal_person_position: string;
  focal_person_phone: string;
  focal_person_email: string;
  alternate_contact: string | null;
  geographic_coverage: string[];
  involvement: string[];
  involvement_others: string | null;
  ongoing_initiatives: string;
  partnerships: string;
  contribution_plan: string;
  support_required: string;
  created_at?: string;
}

export interface InputSupplierData {
  id?: number;
  user_id: string;
  company_name: string;
  contact_person: string;
  inputs_supplied: string;
  regions_of_distribution: string;
  sales_volume: string;
  distribution_channels: string[];
  partnerships: string;
  training_farmers: string;
  bulk_packages: string;
  created_at?: string;
}

export interface InvestorData {
  id?: number;
  user_id: string;
  name: string;
  company: string | null;
  contact_details: string;
  investment_focus: string[];
  past_investment_experience: string;
  preferred_instruments: string[];
  investment_size_range: string;
  time_horizon: string;
  areas_of_interest: string[];
  co_investment: string;
  pitch_forums: string;
  created_at?: string;
}

export interface NGOData {
  id?: number;
  user_id: string;
  organization_name: string;
  type: string[];
  type_other: string | null;
  year_established: string;
  head_office_address: string;
  email_address: string;
  phone_numbers: string;
  website: string | null;
  social_media_handles: string | null;
  contact_full_name: string;
  contact_designation: string;
  contact_phone_number: string;
  contact_email_address: string;
  alternate_contact: string | null;
  focus_areas: string[];
  focus_areas_other: string | null;
  past_projects: string;
  ongoing_projects: string;
  collaborating_agencies: string;
  engagement: string[];
  resources: string[];
  resources_other: string | null;
  support_required: string[];
  created_at?: string;
}

export interface RetailerData {
  id?: number;
  user_id: string;
  business_name: string;
  retail_operation_type: string[];
  retail_operation_type_other: string | null;
  year_established: string;
  store_addresses: string;
  email_address: string;
  phone_numbers: string;
  business_registration_number: string | null;
  owner_full_name: string;
  owner_position: string;
  owner_phone_number: string;
  owner_email_address: string;
  commodities_sold: string;
  daily_sales_volume: string;
  primary_suppliers: string;
  customer_base: string[];
  payment_methods: string[];
  programme_goals: string;
  support_needed: string;
  created_at?: string;
}

export interface TransportCompanyData {
  id?: number;
  user_id: string;
  company_name: string;
  contact_person: string;
  fleet_size_refrigerated: string | null;
  fleet_size_flatbed: string | null;
  fleet_size_vans: string | null;
  regions_of_service: string;
  vehicle_ownership: string[];
  commodities_transported: string;
  volume_capacity: string;
  cold_chain_capabilities: string;
  warehousing_points: string;
  created_at?: string;
}

// Query Keys
export const queryKeys = {
  auth: {
    user: () => ["auth", "user"] as const,
  },
  users: {
    all: () => ["users"] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
  },
  farmers: {
    all: () => ["farmers"] as const,
    byUser: (userId: string) => ["farmers", "user", userId] as const,
  },
  bulkTraders: {
    all: () => ["bulkTraders"] as const,
    byUser: (userId: string) => ["bulkTraders", "user", userId] as const,
  },
  aggregators: {
    all: () => ["aggregators"] as const,
    byUser: (userId: string) => ["aggregators", "user", userId] as const,
  },
  governmentAgencies: {
    all: () => ["governmentAgencies"] as const,
    byUser: (userId: string) => ["governmentAgencies", "user", userId] as const,
  },
  inputSuppliers: {
    all: () => ["inputSuppliers"] as const,
    byUser: (userId: string) => ["inputSuppliers", "user", userId] as const,
  },
  investors: {
    all: () => ["investors"] as const,
    byUser: (userId: string) => ["investors", "user", userId] as const,
  },
  ngos: {
    all: () => ["ngos"] as const,
    byUser: (userId: string) => ["ngos", "user", userId] as const,
  },
  retailers: {
    all: () => ["retailers"] as const,
    byUser: (userId: string) => ["retailers", "user", userId] as const,
  },
  transportCompanies: {
    all: () => ["transportCompanies"] as const,
    byUser: (userId: string) => ["transportCompanies", "user", userId] as const,
  },
} as const;

// Query Functions
export const queryFunctions = {
  // Get current authenticated user
  getAuthUser: async (): Promise<User | null> => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error) {
      throw error;
    }
    return user;
  },
  // Get user profile from database
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      // If user doesn't exist in profiles table, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get farmer data by user ID
  getFarmerByUserId: async (userId: string): Promise<FarmerData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("farmers")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If farmer doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get bulk trader data by user ID
  getBulkTraderByUserId: async (
    userId: string
  ): Promise<BulkTraderData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("bulk_traders")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If bulk trader doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get aggregator data by user ID
  getAggregatorByUserId: async (
    userId: string
  ): Promise<AggregatorData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("aggregators")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If aggregator doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get government agency data by user ID
  getGovernmentAgencyByUserId: async (
    userId: string
  ): Promise<GovernmentAgencyData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("government_agencies")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If government agency doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get input supplier data by user ID
  getInputSupplierByUserId: async (
    userId: string
  ): Promise<InputSupplierData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("input_suppliers")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If input supplier doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get investor data by user ID
  getInvestorByUserId: async (userId: string): Promise<InvestorData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("investors")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If investor doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get NGO data by user ID
  getNGOByUserId: async (userId: string): Promise<NGOData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("ngos")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If NGO doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get retailer data by user ID
  getRetailerByUserId: async (userId: string): Promise<RetailerData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("retailers")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If retailer doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
  // Get transport company data by user ID
  getTransportCompanyByUserId: async (
    userId: string
  ): Promise<TransportCompanyData | null> => {
    if (!userId) return null;
    const { data, error } = await supabaseClient
      .from("transport_companies")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      // If transport company doesn't exist, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },
};

// Mutation Functions
export const mutationFunctions = {
  // Update user profile
  updateUserProfile: async ({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<UserProfile>;
  }): Promise<UserProfile> => {
    const { data, error } = await supabaseClient
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit farmer form
  submitFarmerForm: async (
    farmerData: Omit<FarmerData, "id" | "created_at">
  ): Promise<FarmerData> => {
    const { data, error } = await supabaseClient
      .from("farmers")
      .insert(farmerData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Update user form submission status
  updateFormSubmissionStatus: async (userId: string): Promise<UserProfile> => {
    const { data, error } = await supabaseClient
      .from("users")
      .update({ form_submitted: true })
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Sign out user
  signOutUser: async (): Promise<void> => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
  },
  // Submit bulk trader form
  submitBulkTraderForm: async (
    bulkTraderData: Omit<BulkTraderData, "id" | "created_at">
  ): Promise<BulkTraderData> => {
    const { data, error } = await supabaseClient
      .from("bulk_traders")
      .insert(bulkTraderData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit aggregator form
  submitAggregatorForm: async (
    aggregatorData: Omit<AggregatorData, "id" | "created_at">
  ): Promise<AggregatorData> => {
    const { data, error } = await supabaseClient
      .from("aggregators")
      .insert(aggregatorData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit government agency form
  submitGovernmentAgencyForm: async (
    governmentAgencyData: Omit<GovernmentAgencyData, "id" | "created_at">
  ): Promise<GovernmentAgencyData> => {
    const { data, error } = await supabaseClient
      .from("government_agencies")
      .insert(governmentAgencyData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit input supplier form
  submitInputSupplierForm: async (
    inputSupplierData: Omit<InputSupplierData, "id" | "created_at">
  ): Promise<InputSupplierData> => {
    const { data, error } = await supabaseClient
      .from("input_suppliers")
      .insert(inputSupplierData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit investor form
  submitInvestorForm: async (
    investorData: Omit<InvestorData, "id" | "created_at">
  ): Promise<InvestorData> => {
    const { data, error } = await supabaseClient
      .from("investors")
      .insert(investorData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit NGO form
  submitNGOForm: async (
    ngoData: Omit<NGOData, "id" | "created_at">
  ): Promise<NGOData> => {
    const { data, error } = await supabaseClient
      .from("ngos")
      .insert(ngoData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit retailer form
  submitRetailerForm: async (
    retailerData: Omit<RetailerData, "id" | "created_at">
  ): Promise<RetailerData> => {
    const { data, error } = await supabaseClient
      .from("retailers")
      .insert(retailerData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  // Submit transport company form
  submitTransportCompanyForm: async (
    transportCompanyData: Omit<TransportCompanyData, "id" | "created_at">
  ): Promise<TransportCompanyData> => {
    const { data, error } = await supabaseClient
      .from("transport_companies")
      .insert(transportCompanyData)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
};
