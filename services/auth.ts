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

  const profileResult = await createProfile(data.user?.id ?? '');
  console.log('Profile creation:', profileResult.message);

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

export async function createProfile(id: string) {
  const { data, error } = await supabase.from('profiles').insert({ id: id }).select();

  if (error) {
    console.log('profiles failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('profiles created:', data[0].id);
  return { success: true, message: 'create profile successful' };
}
