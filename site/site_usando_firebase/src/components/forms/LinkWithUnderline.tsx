import styles from "./LinkWithUnderline.module.css";
import { Link } from "react-router-dom";

interface LinkWithUnderlineProps {
  linkText: string;
  to: string;
  navigationState?: unknown;
}

export default function LinkWithUnderline(props: LinkWithUnderlineProps) {
  return (
    <Link
      className={styles.linkStyle}
      to={props.to}
      state={props.navigationState}
    >
      {props.linkText}
    </Link>
  );
}
