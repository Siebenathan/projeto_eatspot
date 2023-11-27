import styles from "./LinkWithUnderline.module.css";
import { Link } from "react-router-dom";

interface LinkWithUnderlineProps {
  linkText: string;
  to: string;
  navigationState?: unknown;
  underlineColor?: "colorBlue";
  linkStyle?: {fontSize?: string, color?: string, fontWeight?: string};
}

export default function LinkWithUnderline(props: LinkWithUnderlineProps) {
  return (
    <Link
      className={`${styles.linkStyle} ${styles[props.underlineColor ?? ""]}`}
      style={props.linkStyle}
      to={props.to}
      state={props.navigationState}
    >
      {props.linkText}
    </Link>
  );
}
