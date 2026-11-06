export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          slug: string;
          name: string;
          code: string;
          flag: string;
          active_listings_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['countries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['countries']['Insert']>;
      };
      states_provinces: {
        Row: {
          id: string;
          country_id: string;
          country_slug: string;
          slug: string;
          name: string;
          code: string;
          active_listings_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['states_provinces']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['states_provinces']['Insert']>;
      };
      cities: {
        Row: {
          id: string;
          country_id: string;
          state_id: string;
          country_slug: string;
          state_slug: string;
          state_code: string;
          slug: string;
          name: string;
          hero_image: string | null;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          is_popular: boolean;
          active_listings_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cities']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cities']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string | null;
          slug: string;
          display_name: string;
          handle: string;
          tagline: string;
          age: number;
          country_id: string | null;
          state_id: string | null;
          city_id: string | null;
          country_name: string;
          country_slug: string;
          state_name: string;
          state_slug: string;
          city_name: string;
          city_slug: string;
          avatar_url: string;
          cover_url: string;
          bio_snippet: string;
          full_description: string;
          is_verified: boolean;
          is_online: boolean;
          is_featured: boolean;
          status_badge: string;
          categories: string[];
          services: string[];
          languages: string[];
          starting_rate: string | null;
          distance_miles: number | null;
          rating: number;
          review_count: number;
          availability_status: string;
          availability_hours: string | null;
          schedule_notice: string | null;
          incall_available: boolean;
          outcall_available: boolean;
          travel_cities: string[];
          preferred_channel: string;
          inquiry_email: string | null;
          response_time: string;
          booking_policy_note: string | null;
          is_published: boolean;
          last_updated: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      profile_photos: {
        Row: {
          id: string;
          profile_id: string;
          photo_url: string;
          display_order: number;
          is_verified_photo: boolean;
          caption: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profile_photos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['profile_photos']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          profile_id: string | null;
          profile_slug: string | null;
          reporter_email: string | null;
          reason: string;
          details: string;
          status: string;
          resolution_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      moderation_actions: {
        Row: {
          id: string;
          moderator_id: string | null;
          target_type: string;
          target_id: string;
          action_type: string;
          reason: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['moderation_actions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['moderation_actions']['Insert']>;
      };
      content_removal_requests: {
        Row: {
          id: string;
          requester_name: string;
          requester_email: string;
          relationship: string;
          target_profile_url: string;
          reason: string;
          verification_hash: string | null;
          status: string;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['content_removal_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['content_removal_requests']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          ip_hash: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          profile_id: string;
          client_alias: string;
          rating: number;
          comment: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
    };
  };
}
