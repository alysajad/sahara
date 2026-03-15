import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables! Check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const email = 'saharaconnect26@gmail.com';
  const password = 'venividivici'; // Must be at least 6 characters

  console.log(`Attempting to sign up user: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
  } else {
    console.log("Success! Admin user created.");
    console.log("Data:", data);
    console.log("----------------------------------------------------------------");
    console.log(`Please use these credentials to log in:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("NOTE: If Supabase Email Confirmations are enabled, you MUST confirm the email before logging in. You can disable email confirmations in the Supabase Dashboard -> Authentication -> Providers -> Email.");
  }
}

createAdminUser();
