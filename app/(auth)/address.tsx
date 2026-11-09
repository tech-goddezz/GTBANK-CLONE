// app/(auth)/address.tsx
//
// "Provide Address" (S26 in Kyc flow.pdf): four plain grey boxes — State,
// Local Government Area, City, Address. State and LGA open inline pick lists
// (not a Modal-based sheet, which proved unreliable on web). City and Address
// are typed. Proceed stays faded until every box is filled.
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import Button from '../../components/Button';
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
  const insets = useSafeAreaInsets();
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

  // One pick list (used for State and for LGA), shown just under its box.
  const renderPickList = (items: string[], selected: string, onPick: (item: string) => void) => (
    <View style={styles.inlinePicker}>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        style={styles.pickList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.pickRow} onPress={() => onPick(item)}>
            <Text style={[styles.pickRowText, item === selected && styles.pickRowTextActive]}>
              {item}
            </Text>
            {item === selected && (
              <MaterialIcons name="check" size={layout.addrIconSize + 4} color={colors.orange} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={layout.backArrowSize} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>Provide Address</Text>
        <Text style={styles.subtitle}>To proceed, Kindly provide your address</Text>

        {/* State */}
        <TouchableOpacity
          style={[styles.box, styles.firstBox]}
          onPress={() => {
            setStateSheetVisible((prev) => !prev);
            setLgaSheetVisible(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Select your state"
        >
          <Text style={styles.boxText}>{selectedState || 'State'}</Text>
          <MaterialIcons name="expand-more" size={layout.addrIconSize} color={colors.black} />
        </TouchableOpacity>

        {stateSheetVisible &&
          renderPickList(NIGERIAN_STATES, selectedState, (item) => {
            setSelectedState(item);
            setLga('');
            setStateSheetVisible(false);
            setError('');
          })}

        {/* Local Government Area */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            if (!selectedState) return;
            setLgaSheetVisible((prev) => !prev);
            setStateSheetVisible(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Select your LGA"
        >
          <Text style={styles.boxText}>{lga || 'Local Government Area'}</Text>
          <MaterialIcons name="expand-more" size={layout.addrIconSize} color={colors.black} />
        </TouchableOpacity>

        {lgaSheetVisible &&
          renderPickList(NIGERIAN_LGAS[selectedState] || [], lga, (item) => {
            setLga(item);
            setLgaSheetVisible(false);
            setError('');
          })}

        {/* City — typed (there is no list of cities) */}
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor={colors.black}
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Address — typed */}
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor={colors.black}
            value={streetAddress}
            onChangeText={setStreetAddress}
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          label="Proceed"
          onPress={handleStart}
          disabled={!isValid}
          style={styles.proceed}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.addrButtonBottom,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: layout.backArrowTop,
    marginLeft: layout.backArrowLeft,
  },
  title: {
    fontSize: fontSize.heading2,
    lineHeight: lineHeight.heading2,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginTop: layout.idTitleGap,
  },
  subtitle: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    marginTop: layout.addrSubtitleGap,
    marginLeft: layout.idTitleLeft,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: layout.inputHeight,
    marginTop: layout.addrBoxSpacing,
    backgroundColor: colors.inputBackground,
    paddingLeft: layout.addrTextLeft,
    paddingRight: layout.addrIconRight,
  },
  firstBox: {
    marginTop: layout.addrBoxGap,
  },
  boxText: {
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  input: {
    flex: 1,
    height: lineHeight.body,
    padding: 0,
    borderWidth: 0,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
    outlineStyle: 'none',
  } as any,
  inlinePicker: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.inputBackground,
    backgroundColor: colors.white,
  },
  pickList: {
    maxHeight: 300,
  },
  pickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.addrTextLeft,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBackground,
  },
  pickRowText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  pickRowTextActive: {
    fontFamily: fontFamily.medium,
    color: colors.orange,
  },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
  proceed: {
    width: layout.phoneProceedWidth,
    alignSelf: 'flex-end',
    marginRight: layout.addrButtonRight,
    marginTop: 'auto',
  },
});
