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
  TextInput,
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
import { layout } from "../../constants/layout";
import Button from "../../components/Button";
import BottomSheet from "../../components/ui/BottomSheet";
import { useKycStore } from "../../store/useKycStore";
import { useAuthStore } from "../../store/useAuthStore";
import { updateDateOfBirth } from "../../services/auth";

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
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const markDateOfBirthDone = useKycStore((state) => state.markDateOfBirthDone);
  const userId = useAuthStore((state) => state.user?.id);
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

  const handleContinue = async () => {
    if (!selectedDay) {
      setError("Please select your date of birth");
      return;
    }
    if (!isOldEnough(selectedDay, viewMonth, viewYear)) {
      setError(`You must be at least ${MINIMUM_AGE} to open an account`);
      return;
    }
    setError("");
    const dobString = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    await updateDateOfBirth(userId ?? '', dobString);
    markDateOfBirthDone(dobString);
    router.push(`/(auth)/bvn-nin?dob=${dobString}`);
  };

  const [calendarSheetVisible, setCalendarSheetVisible] = useState(false);
  // The pencil icon swaps the calendar for a box to type the date into.
  const [typingDate, setTypingDate] = useState(false);
  const [typedDate, setTypedDate] = useState("");
  const [typedDateError, setTypedDateError] = useState("");

  const closePicker = () => {
    setCalendarSheetVisible(false);
    setTypingDate(false);
    setTypedDateError("");
  };

  const handleCancelPicker = () => {
    setSelectedDay(null);
    closePicker();
  };

  const handleConfirmPicker = () => {
    if (!typingDate) {
      closePicker();
      return;
    }
    const match = typedDate.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const day = match ? Number(match[1]) : 0;
    const month = match ? Number(match[2]) - 1 : 0;
    const year = match ? Number(match[3]) : 0;
    if (!match || month > 11 || day < 1 || day > getDaysInMonth(month, year)) {
      setTypedDateError("Enter the date as DD/MM/YYYY");
      return;
    }
    setViewMonth(month);
    setViewYear(year);
    setSelectedDay(day);
    closePicker();
  };

  // Header of the pickers, e.g. "Mon, Aug 17".
  const headerDay = selectedDay ?? 1;
  const pickerHeading = `${WEEKDAY_NAMES[new Date(viewYear, viewMonth, headerDay).getDay()]}, ${MONTH_NAMES[viewMonth].slice(0, 3)} ${headerDay}`;

  const displayValue =
    selectedDay != null
      ? `${String(selectedDay).padStart(2, "0")} ${MONTH_NAMES[viewMonth]} ${viewYear}`
      : "";

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
        <Text style={styles.title}>Your date of birth</Text>
        <Text style={styles.subtitle}>
          To proceed kindly provide your date of birth
        </Text>
      </View>

      {/* Design shows a single field with a calendar icon, not an inline
          calendar grid sitting on the page — tapping it opens the picker
          in a sheet instead. */}
      <TouchableOpacity
        style={styles.dateField}
        onPress={() => setCalendarSheetVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Select your date of birth"
      >
        <Text style={displayValue ? styles.dateValue : styles.datePlaceholder}>
          {displayValue || "Date of birth"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textGrey} />
      </TouchableOpacity>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.buttonArea}>
        <Button label="Proceed" onPress={handleContinue} />
      </View>

      {/* Date pickers: the calendar (Frame 17.pdf) and, after tapping the
          pencil, a box to type the date (Frame 25.pdf). */}
      <BottomSheet
        visible={calendarSheetVisible}
        onClose={closePicker}
        bare
        topRadius={typingDate ? radius.sheet : radius.datePicker}
      >
        <View style={styles.picker}>
          <Text style={styles.pickerCaption}>Selected date</Text>
          <View style={styles.pickerHeadingRow}>
            <Text style={styles.pickerHeading}>{pickerHeading}</Text>
            <TouchableOpacity
              onPress={() => {
                setTypingDate((t) => !t);
                setTypedDateError("");
              }}
              accessibilityRole="button"
              accessibilityLabel={typingDate ? "Choose from calendar" : "Type the date"}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={typingDate ? "calendar-outline" : "pencil"}
                size={14}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          {typingDate ? (
            <View style={styles.typedDateWrap}>
              <View style={styles.typedDateBox}>
                <Text style={styles.typedDateLabel}>Date</Text>
                <TextInput
                  style={styles.typedDateInput}
                  value={typedDate}
                  onChangeText={setTypedDate}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.textGrey}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  autoFocus
                />
              </View>
              {!!typedDateError && <Text style={styles.typedDateError}>{typedDateError}</Text>}
            </View>
          ) : (
            <>
              {/* Month navigation row */}
              <View style={styles.monthRow}>
                {/* Tapping the month/year label opens the fast year-picker sheet */}
                <TouchableOpacity
                  style={styles.monthYearLabel}
                  onPress={() => setYearSheetVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Jump to a different year"
                >
                  <Text style={styles.monthYearText}>
                    {MONTH_NAMES[viewMonth].slice(0, 3)} {viewYear}
                  </Text>
                  <Ionicons name="caret-down" size={10} color={colors.black} />
                </TouchableOpacity>

                <View style={styles.monthArrows}>
                  <TouchableOpacity
                    onPress={goToPreviousMonth}
                    accessibilityRole="button"
                    accessibilityLabel="Previous month"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="chevron-back" size={14} color={colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={goToNextMonth}
                    accessibilityRole="button"
                    accessibilityLabel="Next month"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="chevron-forward" size={14} color={colors.black} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Weekday labels */}
              <View style={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label, index) => (
                  <Text key={index} style={styles.weekdayLabel}>
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
                    onPress={() => {
                      if (day) setSelectedDay(day);
                    }}
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
            </>
          )}

          <View style={styles.pickerActions}>
            <TouchableOpacity onPress={handleCancelPicker} accessibilityRole="button">
              <Text style={styles.pickerActionText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirmPicker} accessibilityRole="button">
              <Text style={styles.pickerActionText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

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
  container: { flex: 1, backgroundColor: colors.darkNavy },
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
    justifyContent: "center",
  },

  header: { marginBottom: spacing.xxl },
  title: {
    fontSize: fontSize.heading1,
    fontFamily: fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.base,
  },
  picker: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pickerCaption: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginBottom: spacing.xxxl,
  },
  pickerHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxxl,
    paddingRight: spacing.xs,
  },
  pickerHeading: {
    fontSize: fontSize.heading2,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.xxxl,
    marginTop: spacing.xxl,
    paddingRight: spacing.sm,
  },
  pickerActionText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.medium,
    color: colors.datePickerAction,
  },
  typedDateWrap: {
    marginBottom: spacing.sm,
  },
  typedDateBox: {
    height: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.codeBox,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  typedDateLabel: {
    position: "absolute",
    top: -8,
    left: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.white,
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  typedDateInput: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  typedDateError: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.red,
    marginTop: spacing.xs,
  },
  dateField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.dark,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  dateValue: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  datePlaceholder: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.orange,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  monthYearLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  monthArrows: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxxl,
  },
  monthYearText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  weekdayRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
    color: colors.textGrey,
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.md,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 37.7,
    height: 40,
    borderRadius: radius.dayCell,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: colors.orangeLogo,
  },
  dayText: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textDark,
  },
  dayTextSelected: {
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
    marginTop: 370,
    alignItems: 'flex-end',
    height: 44,
    
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
