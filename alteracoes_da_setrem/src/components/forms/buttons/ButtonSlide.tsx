import styles from "./ButtonSlide.module.css";

interface ButtonSlideProps {
  nameAndId: string;
  type: "button" | "reset" | "submit";
  buttonText: string;
  buttonStyle?: any;
  beforeColor?: "greenColor" | "redColor";
  slideDirection:
    | "leftDirection"
    | "rigthDirection"
    | "bottomDirection"
    | "topDirection";
  onClick?(value?: any): any | Promise<any>;
}

export default function ButtonSlide(props: ButtonSlideProps) {
  return (
    <button
      type={props.type}
      style={props.buttonStyle}
      id={props.nameAndId}
      name={props.nameAndId}
      className={`${styles.mainButton} ${styles[props.beforeColor ?? ""]}`}
      onClick={props.onClick}
    >
      {props.buttonText}
    </button>
  );
}
