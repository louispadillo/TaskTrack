// ============================================================================
// components/icons.tsx → the five icons the design uses
// ============================================================================
// The path data below is the exact vector data exported from Figma — none of it
// is drawn by hand. Each icon is normalised to a 24x24 box, which is the size
// the design places them at. Where Figma exported a glyph as a smaller loose
// vector, it is wrapped in a <G transform="translate(...)"> that puts it back
// where it sits inside that 24x24 box, so the geometry stays untouched.
// ----------------------------------------------------------------------------

import Svg, { G, Path } from "react-native-svg";
import { colors, layout } from "./theme";

type IconProps = {
  size?: number;
  color?: string;
};

/** The TaskTrack logo mark in the header. */
export function ListDashes({ size = layout.icon, color = colors.black }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM6.75 17.25H6C5.80109 17.25 5.61032 17.171 5.46967 17.0303C5.32902 16.8897 5.25 16.6989 5.25 16.5C5.25 16.3011 5.32902 16.1103 5.46967 15.9697C5.61032 15.829 5.80109 15.75 6 15.75H6.75C6.94891 15.75 7.13968 15.829 7.28033 15.9697C7.42098 16.1103 7.5 16.3011 7.5 16.5C7.5 16.6989 7.42098 16.8897 7.28033 17.0303C7.13968 17.171 6.94891 17.25 6.75 17.25ZM6.75 12.75H6C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25H6.75C6.94891 11.25 7.13968 11.329 7.28033 11.4697C7.42098 11.6103 7.5 11.8011 7.5 12C7.5 12.1989 7.42098 12.3897 7.28033 12.5303C7.13968 12.671 6.94891 12.75 6.75 12.75ZM6.75 8.25H6C5.80109 8.25 5.61032 8.17098 5.46967 8.03033C5.32902 7.88968 5.25 7.69891 5.25 7.5C5.25 7.30109 5.32902 7.11032 5.46967 6.96967C5.61032 6.82902 5.80109 6.75 6 6.75H6.75C6.94891 6.75 7.13968 6.82902 7.28033 6.96967C7.42098 7.11032 7.5 7.30109 7.5 7.5C7.5 7.69891 7.42098 7.88968 7.28033 8.03033C7.13968 8.17098 6.94891 8.25 6.75 8.25ZM18 17.25H9.75C9.55109 17.25 9.36032 17.171 9.21967 17.0303C9.07902 16.8897 9 16.6989 9 16.5C9 16.3011 9.07902 16.1103 9.21967 15.9697C9.36032 15.829 9.55109 15.75 9.75 15.75H18C18.1989 15.75 18.3897 15.829 18.5303 15.9697C18.671 16.1103 18.75 16.3011 18.75 16.5C18.75 16.6989 18.671 16.8897 18.5303 17.0303C18.3897 17.171 18.1989 17.25 18 17.25ZM18 12.75H9.75C9.55109 12.75 9.36032 12.671 9.21967 12.5303C9.07902 12.3897 9 12.1989 9 12C9 11.8011 9.07902 11.6103 9.21967 11.4697C9.36032 11.329 9.55109 11.25 9.75 11.25H18C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75ZM18 8.25H9.75C9.55109 8.25 9.36032 8.17098 9.21967 8.03033C9.07902 7.88968 9 7.69891 9 7.5C9 7.30109 9.07902 7.11032 9.21967 6.96967C9.36032 6.82902 9.55109 6.75 9.75 6.75H18C18.1989 6.75 18.3897 6.82902 18.5303 6.96967C18.671 7.11032 18.75 7.30109 18.75 7.5C18.75 7.69891 18.671 7.88968 18.5303 8.03033C18.3897 8.17098 18.1989 8.25 18 8.25Z"
        fill={color}
      />
    </Svg>
  );
}

/** Home tab. Exported 18 x 18.75, seated at (3, 2.25) inside the 24pt box. */
export function House({ size = layout.icon, color = colors.navIcon }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="translate(3, 2.2488)">
        <Path
          d="M18 9.00024V18.0002C18 18.1992 17.921 18.3899 17.7803 18.5306C17.6397 18.6712 17.4489 18.7502 17.25 18.7502H0.750009C0.551097 18.7502 0.360332 18.6712 0.219679 18.5306C0.0790272 18.3899 9.42514e-06 18.1992 9.42514e-06 18.0002V9.00024C-0.00069249 8.80304 0.0378174 8.60766 0.1133 8.42547C0.188783 8.24328 0.299732 8.07792 0.439697 7.93899L7.9397 0.438992C8.22097 0.1579 8.60235 0 9.00001 0C9.39766 0 9.77905 0.1579 10.0603 0.438992L17.5603 7.93899C17.7003 8.07792 17.8112 8.24328 17.8867 8.42547C17.9622 8.60766 18.0007 8.80304 18 9.00024Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

/**
 * Create tab. Figma exports the plus as two separate strokes rather than one
 * glyph, so both are placed back at their own offsets.
 */
export function Plus({ size = layout.icon, color = colors.navIcon }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="translate(3, 11.25)">
        <Path
          d="M0.75 0.75H17.25"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <G transform="translate(11.25, 3)">
        <Path
          d="M0.75 0.75V17.25"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

/** Completed tab. */
export function CheckCircle({ size = layout.icon, color = colors.navIcon }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.25 12.75L10.5 15L15.75 9.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The back button on the Profile screen. Exported 9 x 16.5, seated at (6.75, 3.75). */
export function CaretLeft({ size = layout.icon, color = colors.navIcon }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="translate(6.75, 3.75)">
        <Path
          d="M8.25 15.75L0.75 8.25L8.25 0.75"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
