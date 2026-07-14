/**
 * Accessibility Rules — BoardFlow
 */

export const ACCESSIBILITY_RULES = {
  /** Keyboard Navigation */
  keyboard: {
    /** All interactive elements must be reachable via Tab */
    tabNavigation: true,
    /** Board columns and tasks must be navigable via arrow keys */
    arrowKeys: true,
    /** Drag-and-drop must have a keyboard alternative (context menu: "Move to column") */
    dragAndDropAlternative: true,
    /** Enter/Space activates the focused element */
    activateOnEnterOrSpace: true,
    /** Escape closes modals, drawers, dropdowns */
    escapeClosesModals: true,
    /** Focus is trapped inside open modals/drawers */
    focusTrap: true,
    /** Focus returns to trigger element when modal/drawer closes */
    focusReturn: true,
  },

  /** Focus Management */
  focus: {
    /** Visible focus indicator on all interactive elements (minimum 2px outline) */
    visibleIndicator: true,
    /** Focus indicator contrast ratio ≥ 3:1 against background */
    focusContrast: "3:1",
    /** Skip to main content link at top of page */
    skipLink: true,
    /** Focus order follows visual order (left-to-right, top-to-bottom) */
    logicalOrder: true,
  },

  /** Semantic HTML */
  semantic: {
    /** Use <nav> for navigation, <main> for primary content, <aside> for sidebars */
    landmarkElements: true,
    /** Use <h1>-<h6> for headings in hierarchical order */
    headingHierarchy: true,
    /** Use <button> for actions, <a> for navigation */
    correctElements: true,
    /** List items use <ul>/<ol> and <li> */
    listMarkup: true,
  },

  /** ARIA */
  aria: {
    /** Buttons with no visible text have aria-label */
    buttonLabels: true,
    /** Dialog roles on modals with aria-modal="true" */
    dialogRoles: true,
    /** aria-expanded on expandable elements */
    expandedState: true,
    /** aria-current on active navigation items */
    currentPage: true,
    /** aria-live="polite" for dynamic board updates */
    liveRegion: true,
    /** aria-describedby links descriptions to inputs */
    describedBy: true,
  },

  /** Color & Contrast */
  contrast: {
    /** Normal text: ≥ 4.5:1 */
    normalText: "4.5:1",
    /** Large text (≥18px bold or ≥24px): ≥ 3:1 */
    largeText: "3:1",
    /** UI components and graphical objects: ≥ 3:1 */
    uiComponents: "3:1",
    /** Focus indicators: ≥ 3:1 */
    focusIndicator: "3:1",
    /** Do not rely solely on color to convey information (use icons + text) */
    notColorOnly: true,
  },

  /** Motion */
  motion: {
    /** Respect prefers-reduced-motion: reduce or disable animations */
    respectReducedMotion: true,
    /** Essential animations only when reduced-motion is preferred */
    essentialOnlyWhenReduced: true,
    /** No auto-scrolling or auto-playing content */
    noAutoScrolling: true,
  },

  /** Forms */
  forms: {
    /** Every input has an associated <label> */
    labels: true,
    /** Error messages are associated with inputs via aria-describedby */
    errorAssociation: true,
    /** Required fields are indicated visually and via aria-required */
    requiredIndicator: true,
    /** Form submission does not lose data on validation errors */
    preserveInput: true,
  },

  /** Touch Targets */
  touch: {
    /** Minimum touch target: 44x44px */
    minimumSize: "44x44px",
    /** Adequate spacing between touch targets */
    spacing: "8px",
  },

  /** Screen Readers */
  screenReader: {
    /** Board changes announced via aria-live region */
    boardChanges: true,
    /** Loading states announced */
    loadingStates: true,
    /** Toast notifications announced */
    toastAnnouncements: true,
    /** Empty states described meaningfully */
    emptyStates: true,
  },
} as const;

export const MOTION_PRINCIPLES = {
  /** Core Principles */
  principles: {
    functional: "Animation must serve a purpose — guide attention, provide feedback, or communicate state changes",
    performant: "Use GPU-accelerated properties only (transform, opacity). Avoid animating layout properties (width, height, top, left)",
    subtle: "Animation should be felt, not noticed. Duration: 150-300ms. Avoid bouncy or distracting effects in dense UI areas",
    accessible: "Respect prefers-reduced-motion. Provide reduced alternatives for all animations",
    consistent: "Use shared easing curves and durations. Do not create custom animations for individual components",
  },

  /** Where to Animate */
  enabled: [
    "Sidebar expand/collapse (transform, 200ms, easeOut)",
    "Task drawer slide in (transform, 250ms, easeOut)",
    "Modal enter/exit (opacity + scale, 200ms, easeOut)",
    "Notification toast (transform, 200ms, spring for enter)",
    "Task card creation (opacity, 150ms)",
    "Column appearance on add (opacity, 150ms)",
    "Dropdown/popover transitions (opacity, 150ms)",
    "Empty state transitions (opacity, 200ms)",
    "Success feedback (checkmark animation, 300ms)",
  ],

  /** Where NOT to Animate */
  disabled: [
    "Dense board areas during drag (use @dnd-kit built-in)",
    "Task forms and inputs",
    "Data tables and lists",
    "Administrative settings pages",
    "When prefers-reduced-motion is set",
  ],

  /** Default Easing Curves */
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },

  /** Default Durations */
  duration: {
    micro: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    drawer: "250ms",
  },
} as const;
