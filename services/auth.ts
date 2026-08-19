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
  const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const { data, error } = await supabase.from('profiles').insert({ id: id, account_number: randomAccountNumber }).select();

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

export async function updateName(id: string, firstName: string, lastName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', id);

  if (error) {
    console.log('updateName failed:', error.message);
    return { success: false, message: error.message };
  }

  console.log('updateName successful');
  return { success: true, message: 'Name saved' };
}

export async function sendMoney(senderId: string, receiverAccountNumber: string, amount: number, narration: string) {
  const { data: senderProfile } = await supabase.from('profiles').select('balance').eq('id', senderId).single();

  if (!senderProfile || senderProfile.balance < amount) {
    return { success: false, message: 'Insufficient balance' };
  }

  const { data: receiverProfile, error: receiverError } = await supabase.from('profiles').select('id, balance').eq('account_number', receiverAccountNumber).single();

  if (receiverError || !receiverProfile) {
    return { success: false, message: 'Receiver account not found' };
  }

  await supabase.from('profiles').update({ balance: senderProfile.balance - amount }).eq('id', senderId);
  await supabase.from('profiles').update({ balance: receiverProfile.balance + amount }).eq('id', receiverProfile.id);

  const { error: transactionError } = await supabase.from('transactions').insert({
    sender_id: senderId,
    receiver_account_number: receiverAccountNumber,
    amount: amount,
    narration: narration,
  });

  if (transactionError) {
    return { success: false, message: transactionError.message };
  }

  return { success: true, message: 'Transfer successful' };
}

export async function lookupAccountName(accountNumber: string) {
  const { data, error } = await supabase.from('profiles').select('first_name, last_name').eq('account_number', accountNumber).single();

  if (error || !data) {
    return { success: false, name: '' };
  }

  return { success: true, name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() };
}
