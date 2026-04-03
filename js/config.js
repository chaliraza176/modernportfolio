// Supabase Configuration - Global Constants Only
const SB_URL = 'https://fashydbnrivdqyivzynv.supabase.co';
const SB_KEY = 'sb_publishable_wSHizXU6F7RS41nLBnwbrQ_UiVa5YBp';

// We only initialize the client ONCE if it doesn't already exist
if (typeof supabase !== 'undefined' && !window.supabaseClient) {
    window.supabaseClient = supabase.createClient(SB_URL, SB_KEY);
    console.log("Supabase Client initialized successfully.");
}
