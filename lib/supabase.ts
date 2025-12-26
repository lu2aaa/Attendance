
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvfzvloxgjjxicruacuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Znp2bG94Z2pqeGljcnVhY3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2ODQ4NDAsImV4cCI6MjA4MjI2MDg0MH0.PIUoeR-uOlPrOtXrUFYdu-EvhTF3gfg69x4gQrrnro0';

export const supabase = createClient(supabaseUrl, supabaseKey);
