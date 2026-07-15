// app/(tabs)/transfer-flow/processing.tsx
// Multi-state tracker: Funds Sent → In Transit via NIBSS → Credited to Recipient

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import {
  fontSize,
  fontFamily,
  spacing,
  radius,
} from "../../../constants/typography";

type Stage = "sent" | "transit" | "credited";

export default function ProcessingScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("sent");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("transit"), 1500);
    const t2 = setTimeout(() => setStage("credited"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const config = {
    sent: {
      icon: "checkmark-circle" as const,
      iconColor: colors.green,
      title: "Funds Sent",
      subtitle: "Your transfer has been initiated",
      showSpinner: false,
    },
    transit: {
      icon: "swap-horizontal" as const,
      iconColor: colors.orange,
      title: "In Transit via NIBSS",
      subtitle: "This takes a few seconds...",
      showSpinner: true,
    },
    credited: {
      icon: "checkmark-circle" as const,
      iconColor: colors.green,
      title: "Credited to Recipient",
      subtitle: "Transfer completed successfully",
      showSpinner: false,
    },
  };

  const current = config[stage];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress steps */}
        <View style={styles.steps}>
          {(["sent", "transit", "credited"] as Stage[]).map((s, i) => (
            <View key={s} style={styles.stepRow}>
              <View
                style={[
                  styles.stepDot,
                  (stage === s ||
                    (["transit", "credited"].includes(stage) && i === 0) ||
                    (stage === "credited" && i === 1)) &&
                    styles.stepDotActive,
                ]}
              >
                {stage === "credited" || (stage === "transit" && i === 0) ? (
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                ) : null}
              </View>
              {i < 2 && (
                <View
                  style={[
                    styles.stepLine,
                    stage !== "sent" && i === 0 && styles.stepLineActive,
                    stage === "credited" && i === 1 && styles.stepLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <View style={styles.iconWrap}>
          <Ionicons name={current.icon} size={72} color={current.iconColor} />
          {current.showSpinner && (
            <ActivityIndicator
              style={styles.spinner}
              color={colors.orange}
              size="large"
            />
          )}
        </View>

        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      {stage === "credited" && (
        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace("/(tabs)/transfer-flow/receipt")}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: colors.orange },
  stepLine: { width: 48, height: 2, backgroundColor: colors.borderLight },
  stepLineActive: { backgroundColor: colors.orange },
  iconWrap: { alignItems: "center", marginBottom: spacing.xl },
  spinner: { position: "absolute", bottom: -8 },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
    textAlign: "center",
  },
  buttonArea: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  doneButton: {
    backgroundColor: colors.orange,
    height: 54,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
});
