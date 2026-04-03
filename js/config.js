// Supabase Configuration
const SB_URL = 'https://fashydbnrivdqyivzynv.supabase.co';
const SB_KEY = 'sb_publishable_wSHizXU6F7RS41nLBnwbrQ_UiVa5YBp';

// This function safely initializes the client
const getSupabase = () => {
    if (typeof supabase !== 'undefined') {
        return supabase.createClient(SB_URL, SB_KEY);
    }
    console.error("Supabase library not found! Please check your internet connection and script order.");
    return null;
};

// Global instance (initialized safely)
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SB_URL, SB_KEY) : null;
