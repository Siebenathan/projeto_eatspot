import styles from "./Input.module.css";

interface InputProps {
  name: string;
  type: string;
  value?: any;
  placeholder?: string;
  labelText?: string;
  onChange?: (e?: any) => void;
  required?: boolean;
  customClass?: string | null;
  styleLabel?: {};
  stylePlaceholder?: {};
  autocomplete?: boolean;
}

export default function Input(props: InputProps) {
  return (
    <div className={styles.inputContainer}>
      {props.labelText && (
        <label className={styles.labelInput} htmlFor={props.name} style={props.styleLabel}>{props.labelText}</label>
      )}
      <input className={`${styles.selfInput} ${styles[props.customClass? props.customClass : ""]}`}
        type={props.type}
        name={props.name}
        id={props.name}
        value={props.value}
        style={props.stylePlaceholder}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required={props.required}
        autoComplete={props.autocomplete ? "on" : "off"}
      />
    </div>
  );
}
