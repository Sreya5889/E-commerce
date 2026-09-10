export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          website: string | null
          location: string | null
          timezone: string
          language: string
          date_of_birth: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          website?: string | null
          location?: string | null
          timezone?: string
          language?: string
          date_of_birth?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          website?: string | null
          location?: string | null
          timezone?: string
          language?: string
          date_of_birth?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          biography: string | null
          website_url: string | null
          twitter_url: string | null
          linkedin_url: string | null
          youtube_url: string | null
          github_url: string | null
          payout_email: string | null
          payout_method: string
          payout_details: Json
          verification_status: 'pending' | 'approved' | 'rejected' | 'suspended'
          verification_badge: boolean
          verified_at: string | null
          rejection_reason: string | null
          years_of_experience: number
          expertise_areas: string[]
          total_students: number
          total_courses: number
          total_reviews: number
          avg_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          headline?: string | null
          biography?: string | null
          website_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          github_url?: string | null
          payout_email?: string | null
          payout_method?: string
          payout_details?: Json
          verification_status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          verification_badge?: boolean
          verified_at?: string | null
          rejection_reason?: string | null
          years_of_experience?: number
          expertise_areas?: string[]
          total_students?: number
          total_courses?: number
          total_reviews?: number
          avg_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          headline?: string | null
          biography?: string | null
          website_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          youtube_url?: string | null
          github_url?: string | null
          payout_email?: string | null
          payout_method?: string
          payout_details?: Json
          verification_status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          verification_badge?: boolean
          verified_at?: string | null
          rejection_reason?: string | null
          years_of_experience?: number
          expertise_areas?: string[]
          total_students?: number
          total_courses?: number
          total_reviews?: number
          avg_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          icon: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          icon?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          teacher_id: string
          category_id: string
          subcategory_id: string | null
          title: string
          slug: string
          subtitle: string | null
          description: string
          language: string
          level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
          status: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived'
          price: number
          discount_price: number | null
          is_free: boolean
          is_published: boolean
          is_bestseller: boolean
          is_featured: boolean
          thumbnail_url: string | null
          cover_image_url: string | null
          preview_video_url: string | null
          duration_hours: number
          student_count: number
          avg_rating: number
          review_count: number
          meta_title: string | null
          meta_description: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          category_id: string
          subcategory_id?: string | null
          title: string
          slug: string
          subtitle?: string | null
          description: string
          language?: string
          level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
          status?: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived'
          price?: number
          discount_price?: number | null
          is_free?: boolean
          is_published?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          thumbnail_url?: string | null
          cover_image_url?: string | null
          preview_video_url?: string | null
          duration_hours?: number
          student_count?: number
          avg_rating?: number
          review_count?: number
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          category_id?: string
          subcategory_id?: string | null
          title?: string
          slug?: string
          subtitle?: string | null
          description?: string
          language?: string
          level?: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
          status?: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived'
          price?: number
          discount_price?: number | null
          is_free?: boolean
          is_published?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          thumbnail_url?: string | null
          cover_image_url?: string | null
          preview_video_url?: string | null
          duration_hours?: number
          student_count?: number
          avg_rating?: number
          review_count?: number
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_sections: {
        Row: {
          id: string
          course_id: string
          title: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      course_lessons: {
        Row: {
          id: string
          section_id: string
          title: string
          lesson_type: 'video' | 'article' | 'quiz' | 'assignment' | 'project'
          content: string | null
          video_url: string | null
          duration_minutes: number
          is_preview: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          title: string
          lesson_type?: 'video' | 'article' | 'quiz' | 'assignment' | 'project'
          content?: string | null
          video_url?: string | null
          duration_minutes?: number
          is_preview?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          title?: string
          lesson_type?: 'video' | 'article' | 'quiz' | 'assignment' | 'project'
          content?: string | null
          video_url?: string | null
          duration_minutes?: number
          is_preview?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      course_resources: {
        Row: {
          id: string
          lesson_id: string
          title: string
          file_url: string
          file_type: string | null
          file_size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          file_url: string
          file_type?: string | null
          file_size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          file_url?: string
          file_type?: string | null
          file_size_bytes?: number | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          order_id: string | null
          progress_percentage: number
          completed: boolean
          enrolled_at: string
          completed_at: string | null
          last_accessed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          order_id?: string | null
          progress_percentage?: number
          completed?: boolean
          enrolled_at?: string
          completed_at?: string | null
          last_accessed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          order_id?: string | null
          progress_percentage?: number
          completed?: boolean
          enrolled_at?: string
          completed_at?: string | null
          last_accessed_at?: string | null
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          lesson_id: string
          completed: boolean
          watched_seconds: number
          completion_percentage: number
          last_position_seconds: number
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          lesson_id: string
          completed?: boolean
          watched_seconds?: number
          completion_percentage?: number
          last_position_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          lesson_id?: string
          completed?: boolean
          watched_seconds?: number
          completion_percentage?: number
          last_position_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
      }
      lesson_bookmarks: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          course_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          subtotal: number
          discount: number
          tax: number
          total: number
          currency: string
          coupon_id: string | null
          payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          subtotal?: number
          discount?: number
          tax?: number
          total?: number
          currency?: string
          coupon_id?: string | null
          payment_status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
          subtotal?: number
          discount?: number
          tax?: number
          total?: number
          currency?: string
          coupon_id?: string | null
          payment_status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          course_id: string
          instructor_id: string
          course_title: string
          unit_price: number
          discount: number
          final_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          course_id: string
          instructor_id: string
          course_title: string
          unit_price: number
          discount?: number
          final_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          course_id?: string
          instructor_id?: string
          course_title?: string
          unit_price?: number
          discount?: number
          final_price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          user_id: string
          payment_method: string
          payment_gateway: string
          transaction_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          gateway_response: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          payment_method?: string
          payment_gateway?: string
          transaction_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          gateway_response?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          payment_method?: string
          payment_gateway?: string
          transaction_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          gateway_response?: Json
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_order_amount: number
          maximum_discount: number | null
          usage_limit: number | null
          used_count: number
          per_user_limit: number
          starts_at: string
          expires_at: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_order_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          per_user_limit?: number
          starts_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          minimum_order_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          per_user_limit?: number
          starts_at?: string
          expires_at?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coupon_usages: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          order_id: string | null
          used_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          order_id?: string | null
          used_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          order_id?: string | null
          used_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          course_id: string
          user_id: string
          rating: number
          review: string | null
          instructor_reply: string | null
          reply_created_at: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          user_id: string
          rating: number
          review?: string | null
          instructor_reply?: string | null
          reply_created_at?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          user_id?: string
          rating?: number
          review?: string | null
          instructor_reply?: string | null
          reply_created_at?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          message: string | null
          attachment_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          message?: string | null
          attachment_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          message?: string | null
          attachment_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          certificate_number: string
          user_id: string
          course_id: string
          issued_at: string
          verification_code: string
        }
        Insert: {
          id?: string
          certificate_number: string
          user_id: string
          course_id: string
          issued_at?: string
          verification_code?: string
        }
        Update: {
          id?: string
          certificate_number?: string
          user_id?: string
          course_id?: string
          issued_at?: string
          verification_code?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          criteria: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          criteria?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          criteria?: Json
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      recently_viewed_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          viewed_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          course_id: string | null
          instructor_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          course_id?: string | null
          instructor_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          course_id?: string | null
          instructor_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          target_audience: 'all' | 'students' | 'teachers' | 'admins'
          published: boolean
          published_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          target_audience?: 'all' | 'students' | 'teachers' | 'admins'
          published?: boolean
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          target_audience?: 'all' | 'students' | 'teachers' | 'admins'
          published?: boolean
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      faq: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: 'new' | 'in_progress' | 'resolved' | 'closed'
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          old_data: Json
          new_data: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          old_data?: Json
          new_data?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          old_data?: Json
          new_data?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          role_name: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_teacher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_student: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_support: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      calculate_course_progress: {
        Args: {
          p_user_id: string
          p_course_id: string
        }
        Returns: number
      }
      verify_certificate: {
        Args: {
          p_cert_num: string
        }
        Returns: {
          id: string
          certificate_number: string
          issued_at: string
          student_name: string
          course_title: string
          instructor_name: string
        }[]
      }
      create_order_from_cart: {
        Args: {
          p_user_id: string
          p_coupon_code?: string | null
        }
        Returns: {
          id: string
          order_number: string
          subtotal: number
          discount: number
          tax: number
          total: number
          currency: string
        }[]
      }
      process_successful_payment: {
        Args: {
          p_order_id: string
          p_payment_gateway?: string
          p_transaction_id?: string
          p_amount?: number
          p_currency?: string
        }
        Returns: boolean
      }
      search_courses: {
        Args: {
          search_term?: string
          category_slug?: string
          p_level?: string
          min_price?: number
          max_price?: number
          p_sort?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: Database['public']['Tables']['courses']['Row'][]
      }
      get_recommended_courses: {
        Args: {
          p_limit?: number
        }
        Returns: Database['public']['Tables']['courses']['Row'][]
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_revenue: number
          total_orders: number
          total_students: number
          total_teachers: number
          total_courses: number
          pending_verifications: number
        }[]
      }
      generate_certificate: {
        Args: {
          p_user_id: string
          p_course_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
