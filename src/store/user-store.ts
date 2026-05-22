import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase';

interface User {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  plan: 'monthly' | 'yearly';
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (fullname: string, phone: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  initializeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,

  initializeUser: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('gutscore_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          set({ user: parsed, isLoggedIn: true });
        }
      }
    } catch (e) {
      console.error('Failed to initialize user session:', e);
    }
  },

  login: async (fullname: string, phone: string) => {
    try {
      const client = getSupabase();
      
      // Clean inputs
      const cleanPhone = phone.trim();
      const cleanName = fullname.trim().toLowerCase();

      // Query from Supabase
      const { data, error } = await client
        .from('subscription_requests')
        .select('*')
        .eq('phone', cleanPhone)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return { 
          success: false, 
          message: 'Không tìm thấy thông tin đăng ký cho số điện thoại này. Vui lòng đăng ký Premium trước.' 
        };
      }

      // Check if any matching request is approved
      const approvedRequest = data.find(req => req.status === 'approved');

      if (!approvedRequest) {
        // If there's a request but not approved yet
        const status = data[0].status;
        if (status === 'pending') {
          return { 
            success: false, 
            message: 'Tài khoản của bạn ĐANG CHỜ DUYỆT. Vui lòng hoàn tất chuyển khoản và liên hệ Bác sĩ Phan Anh Tuấn để được kích hoạt.' 
          };
        } else {
          return { 
            success: false, 
            message: 'Yêu cầu đăng ký của bạn đã bị TỪ CHỐI. Vui lòng liên hệ Admin để giải quyết.' 
          };
        }
      }

      // Verify name if provided (loose case-insensitive check)
      const dbName = approvedRequest.fullname.toLowerCase();
      if (cleanName && !dbName.includes(cleanName) && !cleanName.includes(dbName)) {
        return {
          success: false,
          message: 'Họ tên không trùng khớp với số điện thoại đã được duyệt. Vui lòng kiểm tra lại.'
        };
      }

      const userData: User = {
        id: approvedRequest.id,
        fullname: approvedRequest.fullname,
        phone: approvedRequest.phone,
        email: approvedRequest.email,
        status: approvedRequest.status,
        plan: approvedRequest.plan,
      };

      // Persist locally
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('gutscore_user', JSON.stringify(userData));
      }

      set({ user: userData, isLoggedIn: true });
      return { success: true, message: 'Đăng nhập thành công!' };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.' };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('gutscore_user');
    }
    set({ user: null, isLoggedIn: false });
  },
}));
