import { supabase } from '../lib/supabase';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log('Signup failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('Signup successful:', data.user?.email);
  return { success: true, message: 'Account created!' };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log('signIn failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('signIn successful:', data.user?.email);
  return { success: true, message: 'login successful' };
}
