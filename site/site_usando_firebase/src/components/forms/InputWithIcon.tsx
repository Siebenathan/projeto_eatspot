import styles from "./InputWithIcon.module.css";

interface InputWithIconProps {
  name: string;
  type: string;
  icon: any;
  placeholderText: string;
}

export default function InputWithIcon(props: InputWithIconProps) {
  return (
    <div className={styles.inputIconMainDiv}>
      {props.icon}
      <input type={props.type} placeholder={props.placeholderText} className={styles.inputStyle} />
    </div>
  );
}
