import styles from "./TextArea.module.css";

interface TextAreaProps {
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue: any;
  handleChange(value: any): void;
  maxLength?: number;
}

export default function TextArea(props: TextAreaProps) {
  return (
    <textarea
      className={styles.textAreaStyle}
      maxLength={props.maxLength ? props.maxLength : 2500}
      name={props.name}
      id={props.name}
      required={props.required}
      placeholder={props.placeholder}
      value={props.defaultValue}
      onChange={(e: any) => {
        props.handleChange(e.target.value);
      }}
    ></textarea>
  );
}
