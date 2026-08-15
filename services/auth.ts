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
  return { success: true, message: 'Account created!', userId: data.user?.id };
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
  return { success: true, message: 'login successful', userId: data.user?.id };
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

export async function fetchProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select().eq('id', id).single();

  if (error) {
    console.log('fetchProfile failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('fetchProfile successful:', data);
  return { success: true, profile: data };
}

export async function updateDateOfBirth(id: string, dateOfBirth: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ date_of_birth: dateOfBirth })
    .eq('id', id);

  if (error) {
    console.log('updateDateOfBirth failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('updateDateOfBirth successful');
  return { success: true, message: 'Date of birth saved' };
}

export async function updateBvnNin(id: string, type: 'bvn' | 'nin', number: string) {
  const columnToUpdate = type === 'bvn' ? { bvn: number } : { nin: number };

  const { data, error } = await supabase
    .from('profiles')
    .update(columnToUpdate)
    .eq('id', id);

  if (error) {
    console.log('updateBvnNin failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('updateBvnNin successful');
  return { success: true, message: 'BVN/NIN saved' };
}

export async function updateAddress(id: string, state: string, lga: string, city: string, streetAddress: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      state: state,
      lga: lga,
      city: city,
      street_address: streetAddress,
    })
    .eq('id', id);

  if (error) {
    console.log('updateAddress failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('updateAddress successful');
  return { success: true, message: 'Address saved' };
}

export async function updateIdentityVerified(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ identity_verified: true })
    .eq('id', id);

  if (error) {
    console.log('updateIdentityVerified failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('updateIdentityVerified successful');
  return { success: true, message: 'Identity verified' };
}

export async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? '';
}
