import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { updateName, getCurrentUserId } from '../../services/auth';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async () => {
    const id = await getCurrentUserId();
    await updateName(id, firstName, lastName);
    router.replace('/(auth)/requirements');
  };

  return (
    <View>
      <Text>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />

      <Text>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />

      <TouchableOpacity onPress={handleSubmit}>
        <Text>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
