import styles from "./ButtonBeating.module.css";

interface ButtonBeatingProps {
  buttonText: string;
  nameAndId: string;
  buttonStyle?: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    height?: string;
    width?: string;
  };
  onClick?(): any;
}

export default function ButtonBeating(props: ButtonBeatingProps) {
  return (
    <button
      className={styles.mainButton}
      style={props.buttonStyle}
      onClick={props.onClick}
    >
      {props.buttonText}
    </button>
  );
}
