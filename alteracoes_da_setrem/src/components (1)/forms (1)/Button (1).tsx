import styles from "./Button.module.css";

interface ButtonProps {
  buttonText: string;
  type: "button" | "submit" | "reset";
  style?: {};
  onClick?(): any;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className={`${styles.buttonContainer}`}
      style={props.style}
      type={props.type}
      onClick={props.onClick}
    >
      {props.buttonText}
    </button>
  );
}
