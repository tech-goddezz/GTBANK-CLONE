// app/(auth)/address.tsx
//
// Residential address entry. State and LGA use inline pickers (not a
// Modal-based sheet, which proved unreliable on web).
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import { useKycStore } from '../../store/useKycStore';
import { useAuthStore } from '../../store/useAuthStore';
import { updateAddress } from '../../services/auth';
import { NIGERIAN_LGAS } from '../../constants/nigerianLgas';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
  'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Abuja (FCT)',
];

export default function AddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dob: string;
    verificationType: string;
    verificationNumber: string;
  }>();
  const markAddressDone = useKycStore((state) => state.markAddressDone);
  const userId = useAuthStore((state) => state.user?.id);

  const [selectedState, setSelectedState] = useState('');
  const [lga, setLga] = useState('');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [error, setError] = useState('');
  const [stateSheetVisible, setStateSheetVisible] = useState(false);
  const [lgaSheetVisible, setLgaSheetVisible] = useState(false);

  const isValid =
    !!selectedState &&
    lga.trim().length > 1 &&
    city.trim().length > 1 &&
    streetAddress.trim().length > 3;

  const handleStart = async () => {
    if (!isValid) {
      setError('Please fill in all address fields');
      return;
    }
    setError('');
    await updateAddress(userId ?? '', selectedState, lga, city, streetAddress);
    markAddressDone();
    router.push(
      `/(auth)/identity?dob=${params.dob}&verificationType=${params.verificationType}&verificationNumber=${params.verificationNumber}&state=${selectedState}&lga=${lga}&city=${city}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Provide Address</Text>
          <Text style={styles.subtitle}>To proceed, kindly provide your address</Text>
        </View>

        <TouchableOpacity
          style={styles.dropdownField}
          onPress={() => {
            setStateSheetVisible((prev) => !prev);
            setLgaSheetVisible(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Select your state"
        >
          <Text style={selectedState ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {selectedState || 'State'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textGrey} />
        </TouchableOpacity>

        {stateSheetVisible && (
          <View style={styles.inlinePicker}>
            <FlatList
              data={NIGERIAN_STATES}
              keyExtractor={(item) => item}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stateRow}
                  onPress={() => {
                    setSelectedState(item);
                    setLga('');
                    setStateSheetVisible(false);
                    setError('');
                  }}
                >
                  <Text
                    style={[
                      styles.stateRowText,
                      item === selectedState && styles.stateRowTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedState && (
                    <Ionicons name="checkmark" size={18} color={colors.orange} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.dropdownField}
          onPress={() => {
            if (!selectedState) return;
            setLgaSheetVisible((prev) => !prev);
            setStateSheetVisible(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Select your LGA"
        >
          <Text style={lga ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {lga || 'Local Government Area'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textGrey} />
        </TouchableOpacity>

        {lgaSheetVisible && (
          <View style={styles.inlinePicker}>
            <FlatList
              data={NIGERIAN_LGAS[selectedState] || []}
              keyExtractor={(item) => item}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stateRow}
                  onPress={() => {
                    setLga(item);
                    setLgaSheetVisible(false);
                    setError('');
                  }}
                >
                  <Text
                    style={[
                      styles.stateRowText,
                      item === lga && styles.stateRowTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === lga && (
                    <Ionicons name="checkmark" size={18} color={colors.orange} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TextInput
          style={[styles.textInput, { borderColor: colors.lighter }]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={[styles.textInput, styles.multiline, { borderColor: colors.lighter }]}
          placeholder="Street Address"
          value={streetAddress}
          onChangeText={setStreetAddress}
          multiline
          numberOfLines={3}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkNavy,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginTop: 70,
    marginBottom: spacing.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: spacing.sm,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.lighter,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dropdownValue: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  dropdownPlaceholder: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textFaded,
  },
  inlinePicker: {
    borderWidth: 1,
    borderColor: colors.lighter,
    borderRadius: radius.input,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lighter,
  },
  stateRowText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  stateRowTextActive: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
  textInput: {
    height: 52,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  multiline: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  errorText: {
    fontSize: fontSize.small,
    color: colors.red,
    marginBottom: spacing.md,
  },
  buttonArea: {
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.orange,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.body,
  },
});
