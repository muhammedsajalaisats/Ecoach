import { createClient } from '@supabase/supabase-js';

// Single shared Supabase client — import this everywhere instead of calling createClient() again.
const supabaseUrl = 'https://oqxpbtvzaqwznzjcwjdd.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeHBidHZ6YXF3em56amN3amRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjI2MjQsImV4cCI6MjA3MjAzODYyNH0.E_B9WhK5QGncAyI_xnnO0gzpbWaHoBdDs4SfBQmkI9U';

export const supabase = createClient(supabaseUrl, supabaseKey);
