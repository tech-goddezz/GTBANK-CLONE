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

  const profileResult = await createProfile(data.user?.id ?? '', email, password);
  console.log('Profile creation:', profileResult.message);

  const cardResult = await createCard(data.user?.id ?? '');
  console.log('Card creation:', cardResult.message);

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

export async function createProfile(id: string, email: string, password: string) {
  const randomAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const { data, error } = await supabase.from('profiles').insert({ id: id, account_number: randomAccountNumber, email: email}).select();

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

export async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('fetchTransactions failed:', error.message);
    return { success: false, transactions: [] };
  }

  return { success: true, transactions: data };
}

export async function payBill(userId: string, billType: string, amount: number) {
  const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();

  if (!profile || profile.balance < amount) {
    return { success: false, message: 'Insufficient balance' };
  }

  await supabase.from('profiles').update({ balance: profile.balance - amount }).eq('id', userId);

  const { error } = await supabase.from('transactions').insert({
    sender_id: userId,
    receiver_account_number: `BILL-${billType.toUpperCase()}`,
    amount: amount,
    narration: `${billType} payment`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Payment successful' };
}

export async function topUpBalance(userId: string, amount: number) {
  const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();

  if (!profile) {
    return { success: false, message: 'Profile not found' };
  }

  await supabase.from('profiles').update({ balance: profile.balance + amount }).eq('id', userId);

  const { error } = await supabase.from('transactions').insert({
    sender_id: userId,
    receiver_account_number: 'TOPUP',
    amount: amount,
    narration: 'Wallet top up',
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Top up successful' };
}

export async function signOutUser() {
  await supabase.auth.signOut();
}

export async function createCard(userId: string) {
  const randomCardNumber = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join('');
  const currentYear = new Date().getFullYear();
  const expiryYear = (currentYear + 4).toString().slice(-2);
  const randomExpiry = `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${expiryYear}`;
  

  const { error } = await supabase.from('cards').insert({
    user_id: userId,
    masked_number: randomCardNumber,
    expiry_date: randomExpiry,
  });

  if (error) {
    console.log('createCard failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Card created' };
}

export async function fetchCard(userId: string) {
  const { data, error } = await supabase.from('cards').select().eq('user_id', userId).single();

  if (error) {
    console.log('fetchCard failed:', error.message);
    return { success: false, card: null };
  }

  return { success: true, card: data };
}

export async function toggleCardFreeze(userId: string, isFrozen: boolean) {
  const { error } = await supabase.from('cards').update({ is_frozen: !isFrozen }).eq('user_id', userId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Card status updated' };
}

export async function applyForHigherLimit(userId: string, employmentStatus: string, monthlyIncome: number, employerName: string) {
  const { error } = await supabase.from('profiles').update({
    employment_status: employmentStatus,
    monthly_income: monthlyIncome,
    employer_name: employerName,
    tier: 2,
    transfer_limit: 2000000,
  }).eq('id', userId);

  if (error) {
    console.log('applyForHigherLimit failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Verification complete! Your limit has been increased.' };
}

export async function reportTransaction(userId: string, transactionId: string, reason: string) {
  const { error } = await supabase.from('transaction_reports').insert({
    user_id: userId,
    transaction_id: transactionId,
    reason: reason,
  });

  if (error) {
    console.log('reportTransaction failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Report submitted successfully' };
}

export async function savePhoneNumber(id: string, phoneNumber: string) {
  const { error } = await supabase.from('profiles').update({ phone_number: phoneNumber }).eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Phone number saved' };
}

export async function lookupEmailByPhone(phoneNumber: string) {
  const { data, error } = await supabase.from('profiles').select('email').eq('phone_number', phoneNumber).single();

  if (error || !data?.email) {
    return { success: false, email: '' };
  }

  return { success: true, email: data.email };
}

export async function setPin(id: string, pin: string) {
  const { error } = await supabase.rpc('set_pin', { p_user_id: id, p_pin: pin });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'PIN set successfully' };
}

export async function signInWithUserIdAndPin(userId: string, pin: string) {
  const { data, error } = await supabase.rpc('verify_pin_by_id', { p_user_id: userId, p_pin: pin });

  if (error || !data) {
    return { success: false, message: 'Incorrect PIN' };
  }

  return { success: true, message: 'PIN verified', userId };
}

  export async function signInWithPin(phoneNumber: string, pin: string) {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    return { success: false, message: 'Please sign in with your email and password first' };
  }

  const userId = sessionData.session.user.id;

  const { data, error } = await supabase.rpc('verify_pin_by_id', { p_user_id: userId, p_pin: pin });

  if (error || !data) {
    return { success: false, message: 'Incorrect PIN' };
  }

  return { success: true, message: 'PIN verified', userId };
}



  

export async function checkPhoneExists(phoneNumber: string) {
  const { data, error } = await supabase.from('profiles').select('id').eq('phone_number', phoneNumber).single();

  if (error || !data) {
    return { exists: false };
  }

  return { exists: true, userId: data.id };
}
