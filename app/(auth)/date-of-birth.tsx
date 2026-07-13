// app/(auth)/date-of-birth.tsx
// A self-built inline calendar — no external date-picker package needed.
// The user taps a day, can flip months with the arrows, and can jump
// years fast using a slide-up list (reusing our BottomSheet component).

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import {
  fontSize,
  fontFamily,
  spacing,
  radius,
} from "../../constants/typography";
import Button from "../../components/Button";
import BottomSheet from "../../components/ui/BottomSheet";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Minimum banking age — GTBank (and most banks) require the account
// holder to be at least 18. We check this before letting them continue.
const MINIMUM_AGE = 18;

// Builds the year list once — from 100 years ago up to the year that
// makes someone exactly MINIMUM_AGE today. No point showing years that
// would make the user underage.
const buildYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const latestValidYear = currentYear - MINIMUM_AGE;
  const years: number[] = [];
  for (let y = latestValidYear; y >= currentYear - 100; y--) {
    years.push(y);
  }
  return years;
};

// How many days are in a given month/year — accounts for leap years
// automatically because we let the Date object do the math for us.
const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Which weekday (0=Sun..6=Sat) the 1st of the month falls on — this is
// what tells us how many empty boxes to pad at the start of the grid.
const getFirstWeekday = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};

export default function DateOfBirthScreen() {
  const router = useRouter();

  // Default view starts at a reasonable adult birth year so the user
  // isn't stuck scrolling from the current month on first open.
  const defaultYear = new Date().getFullYear() - MINIMUM_AGE - 5;
  const [viewMonth, setViewMonth] = useState(4); // May, matching your Figma reference
  const [viewYear, setViewYear] = useState(defaultYear);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [yearSheetVisible, setYearSheetVisible] = useState(false);
  const [error, setError] = useState("");

  const yearOptions = useMemo(buildYearOptions, []);

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstWeekday = getFirstWeekday(viewMonth, viewYear);

  // Builds the flat array the grid renders from: nulls for the empty
  // padding boxes, then 1..daysInMonth for the real day boxes.
  const gridDays: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPreviousMonth = () => {
    setSelectedDay(null); // changing month clears the pick — avoids confusion
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setSelectedDay(null);
    setYearSheetVisible(false);
  };

  // Checks the selected date against MINIMUM_AGE — this is a real rule,
  // not just decoration, so we actually calculate age here rather than
  // trusting that "if the year is old enough" is good enough (someone
  // could pick a valid year but a day/month that hasn't happened yet
  // this year, making them technically a bit younger).
  const isOldEnough = (day: number, month: number, year: number): boolean => {
    const dob = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > month ||
      (today.getMonth() === month && today.getDate() >= day);
    if (!hasHadBirthdayThisYear) age -= 1;
    return age >= MINIMUM_AGE;
  };

  const handleContinue = () => {
    if (!selectedDay) {
      setError("Please select your date of birth");
      return;
    }
    if (!isOldEnough(selectedDay, viewMonth, viewYear)) {
      setError(`You must be at least ${MINIMUM_AGE} to open an account`);
      return;
    }
    setError("");
    // Pass the picked date forward as a param — the account-created
    // screen or a future profile screen could read it back if needed.
    const dobString = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    router.push(`/(auth)/bvn-nin?dob=${dobString}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={colors.textDark} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Date of Birth</Text>
        <Text style={styles.subtitle}>
          Select your date of birth to continue
        </Text>
      </View>

      <View style={styles.calendarCard}>
        {/* Month navigation row */}
        <View style={styles.monthRow}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.textDark} />
          </TouchableOpacity>

          {/* Tapping the month/year label opens the fast year-picker sheet */}
          <TouchableOpacity
            style={styles.monthYearLabel}
            onPress={() => setYearSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Jump to a different year"
          >
            <Text style={styles.monthYearText}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.orange} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.textDark}
            />
          </TouchableOpacity>
        </View>

        {/* Weekday labels */}
        <View style={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label) => (
            <Text key={label} style={styles.weekdayLabel}>
              {label}
            </Text>
          ))}
        </View>

        {/* Day grid */}
        <View style={styles.dayGrid}>
          {gridDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              disabled={day === null}
              onPress={() => day && setSelectedDay(day)}
              accessibilityRole={day ? "button" : undefined}
              accessibilityLabel={day ? `Select day ${day}` : undefined}
            >
              {day !== null && (
                <View
                  style={[
                    styles.dayCircle,
                    selectedDay === day && styles.dayCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDay === day && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.buttonArea}>
        <Button label="Continue" onPress={handleContinue} />
      </View>

      {/* Fast year-jump sheet — reusing the BottomSheet we built earlier */}
      <BottomSheet
        visible={yearSheetVisible}
        onClose={() => setYearSheetVisible(false)}
        title="Select Year"
      >
        <FlatList
          data={yearOptions}
          keyExtractor={(item) => String(item)}
          style={styles.yearList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.yearRow}
              onPress={() => handleSelectYear(item)}
            >
              <Text
                style={[
                  styles.yearRowText,
                  item === viewYear && styles.yearRowTextActive,
                ]}
              >
                {item}
              </Text>
              {item === viewYear && (
                <Ionicons name="checkmark" size={18} color={colors.orange} />
              )}
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </ScrollView>
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
    justifyContent: "center",
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
  calendarCard: {
    backgroundColor: colors.pageBackground,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  monthYearLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  monthYearText: {
    fontSize: fontSize.heading3,
    fontFamily: fontFamily.semibold,
    color: colors.textDark,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    color: colors.textGrey,
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: colors.orange,
  },
  dayText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  dayTextSelected: {
    fontFamily: fontFamily.semibold,
    color: colors.white,
  },
  errorText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  buttonArea: {
    marginTop: spacing.md,
  },
  yearList: {
    maxHeight: 400,
  },
  yearRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  yearRowText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  yearRowTextActive: {
    fontFamily: fontFamily.semibold,
    color: colors.orange,
  },
});
