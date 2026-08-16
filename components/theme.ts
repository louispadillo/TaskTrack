// ============================================================================
// components/theme.ts → the design, written down in one place
// ============================================================================
// Every number and colour here was read off the Figma file. Keeping them in one
// module is what makes the screens genuinely consistent rather than just
// looking similar by accident.
// ----------------------------------------------------------------------------

export const colors = {
  surface: "#ffffff", // behind the status bar
  background: "#f3f3f3", // the page itself
  card: "#ffffff", // task rows and the "Enter task" box

  title: "#000000",
  bodyText: "#333333",
  doneText: "#999999", // a finished task's struck-through label

  // Auth screens
  inputBorder: "#808080",
  error: "#ff1616",
  hint: "#808080",
  primary: "#0088ff",
  onPrimary: "#ffffff",
  divider: "#999999",
  footer: "#808080",

  // Task checkbox
  checkbox: "#333333", // the empty ring
  checkboxDone: "#34c759",
  checkboxDoneBorder: "#0f511f",

  // The floating navigation pill
  navFrom: "rgba(36,38,50,0.55)",
  navTo: "rgba(52,54,69,0.55)",
  navPillFrom: "#242632", // the darker capsule behind the active tab
  navPillTo: "#343645",
  navIcon: "#f4f5f7",

  // The avatar is a placeholder gradient standing in for a profile picture.
  avatarFrom: "#bc1212",
  avatarTo: "#3fccec",

  black: "#000000",
  onBlack: "#ffffff",
} as const;

export const fonts = {
  bold: "Inter_700Bold",
  semiBold: "Inter_600SemiBold",
  medium: "Inter_500Medium",
} as const;

export const layout = {
  // Auth screens
  screenPaddingHorizontal: 36,
  screenPaddingVertical: 50,
  sectionGap: 24,
  fieldGap: 12,
  messageGap: 4,
  radius: 12,
  controlPaddingHorizontal: 16,
  borderedHeight: 43, // inputs and the outlined Google button (41 + 1px border top and bottom)
  filledHeight: 41, // the blue and black buttons

  // Task screens
  gutter: 36, // the px-36 the content sits inside
  headerPadding: 16,
  bodyGap: 36, // header → first section
  listGap: 12, // between task rows
  cardPadding: 16,
  pill: 100, // fully rounded corners
  avatar: 40,
  icon: 24,

  // The nav bar floats over the content rather than sitting below it.
  navBottom: 50,
  navHeight: 56,
  navItem: 56, // one tab: 24pt icon + 16pt padding each side
  navGap: 8,
  navPadding: 8,
} as const;

// How far a scrolling list must stop short of the floating nav bar.
export const listBottomInset =
  layout.navBottom + layout.navHeight + layout.sectionGap;

export const typography = {
  // Auth
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 29,
    color: colors.title,
  },
  control: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 17,
  },
  message: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 17,
  },
  footer: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.24,
    color: colors.footer,
  },

  // Task screens
  /** "TaskTrack", "Profile", "Currently signed in as" */
  appTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.title,
  },
  /** "5 Tasks for today", "Completed tasks", "Create a task" */
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
    color: colors.title,
  },
  /** Task labels, the task input, button labels, the signed-in email */
  body: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.32,
  },
} as const;
