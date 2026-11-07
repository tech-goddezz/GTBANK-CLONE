import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import { fontSize, fontFamily, lineHeight, spacing } from '../../constants/typography';
import { layout } from '../../constants/layout';
import ScreenScroll from '../../components/ScreenScroll';
import UserAvatar from '../../components/UserAvatar';
import Button from '../../components/Button';
import FingerprintSheet from '../../components/FingerprintSheet';

const fingerprint = require('../../assets/images/fingerprint.png');

// Log in with fingerprint. For now this only shows the "Authenticating
// fingerprint" pop-up; a real fingerprint scan would need an extra package.
export default function LoginBiometricScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <ScreenScroll>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, layout.statusBarHeight) }]}>
        <UserAvatar style={styles.avatar} />

        <TouchableOpacity onPress={() => setSheetVisible(true)} activeOpacity={0.7} style={styles.picture}>
          <Image source={fingerprint} style={styles.pictureImage} accessibilityIgnoresInvertColors />
        </TouchableOpacity>

        <Text style={styles.hint}>Click to log in with Fingerprint</Text>

        <Button
          label="Authenticating fingerprint"
          size="small"
          onPress={() => setSheetVisible(true)}
          style={styles.button}
        />

        {/* Bottom links */}
        <View style={styles.links}>
          <TouchableOpacity
            style={styles.linkLeft}
            onPress={() => router.push('/(forgot-password)/requirements')}
            accessibilityRole="button"
          >
            <Text style={styles.linkOrange}>Forget password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRight}
            onPress={() => router.replace(phone ? `/(auth)/login-password?phone=${phone}` : '/(auth)/login-password')}
            accessibilityRole="button"
          >
            <Text style={styles.linkGrey}>Login with Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FingerprintSheet visible={sheetVisible} onCancel={() => setSheetVisible(false)} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xxxl,
  },
  avatar: {
    alignSelf: 'center',
    marginTop: layout.avatarTop,
  },
  picture: {
    alignSelf: 'center',
    marginTop: layout.fingerprintPicGap,
  },
  pictureImage: {
    width: layout.fingerprintSize,
    height: layout.fingerprintSize,
  },
  hint: {
    alignSelf: 'center',
    marginTop: layout.fingerprintHintGap,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontFamily: fontFamily.regular,
    color: colors.textLightDark,
  },
  button: {
    alignSelf: 'center',
    width: layout.fingerprintButtonWidth,
    marginTop: layout.fingerprintButtonGap,
  },
  links: {
    height: lineHeight.phoneRow,
    marginTop: layout.fingerprintLinksGap,
    marginHorizontal: layout.screenPadding,
  },
  linkLeft: {
    position: 'absolute',
    left: layout.passwordLinkLeft,
  },
  linkRight: {
    position: 'absolute',
    left: layout.fingerprintLink2Left,
  },
  linkOrange: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.phoneRow,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  linkGrey: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.phoneRow,
    fontFamily: fontFamily.medium,
    color: colors.textFaded,
  },
});
