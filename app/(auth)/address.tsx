// app/(auth)/address.tsx
// Residential address entry. State selection uses our reusable BottomSheet
// (third time we've used it now — phone/otp, transactions, and here).

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, spacing, radius } from '../../constants/typography';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import BottomSheet from '../../components/ui/BottomSheet';

// A representative set of Nigerian states — enough to make the picker feel
// real for a demo. Swap for the full 36 + FCT list if this goes to production.
const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Kano',
  'Oyo', 'Kaduna', 'Enugu', 'Delta', 'Edo',
];

export default function AddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dob: string;
    verificationType: string;
    verificationNumber: string;
  }>();

  const [stateSheetVisible, setStateSheetVisible] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [lga, setLga] = useState('');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [error, setError] = useState('');

  const isValid =
    !!selectedState &&
    lga.trim().length > 1 &&
    city.trim().length > 1 &&
    streetAddress.trim().length > 3;

  const handleStart = () => {
    if (!isValid) {
      setError('Please fill in all address fields');
      return;
    }
    setError('');
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

        {/* State picker — looks like a text input but opens a sheet instead
            of a keyboard, since state is a fixed list, not free text. */}
        <Text style={styles.fieldLabel}>State</Text>
        <TouchableOpacity
          style={styles.dropdownField}
          onPress={() => setStateSheetVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Select your state"
        >
          <Text style={selectedState ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {selectedState || 'Select your state'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textGrey} />
        </TouchableOpacity>

        {/* Local Government Area — present in the design between State and
            City, and was missing from this screen entirely before. */}
        <InputField
          label="Local Government Area"
          placeholder="e.g. Ikeja"
          value={lga}
          onChangeText={setLga}
        />

        <InputField
          label="City"
          placeholder="e.g. Ikeja"
          value={city}
          onChangeText={setCity}
        />

        <InputField
          label="Address"
          placeholder="House number and street name"
          value={streetAddress}
          onChangeText={setStreetAddress}
          multiline
          style={{ height: 80, textAlignVertical: 'top', paddingTop: spacing.md }}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonArea}>
          <Button label="Proceed" onPress={handleStart} disabled={!isValid} />
        </View>
      </ScrollView>

      <BottomSheet
        visible={stateSheetVisible}
        onClose={() => setStateSheetVisible(false)}
        title="Select State"
      >
        <FlatList
          data={NIGERIAN_STATES}
          keyExtractor={(item) => item}
          style={{ maxHeight: 400 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.stateRow}
              onPress={() => {
                setSelectedState(item);
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
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    marginTop: 56,
    marginBottom: spacing.xl,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: { marginBottom: spacing.xxl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  fieldLabel: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
    marginBottom: spacing.xs,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.inputBackground,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginBottom: spacing.md,
  },
  buttonArea: { marginTop: spacing.md },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  stateRowText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  stateRowTextActive: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
});