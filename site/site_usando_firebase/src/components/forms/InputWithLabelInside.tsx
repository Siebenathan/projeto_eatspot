import styles from "./InputWithLabelInside.module.css";

interface InputWithLabelInsideProps {
  nameAndId: string;
  type: "text" | "password" | "email";
  labelText: string;
  required?: boolean;
}

export default function InputWithLabelInside(props: InputWithLabelInsideProps) {
  return (
    <div className={styles.divInputWithLabelInside}>
      <input
        required={props.required}
        type={props.type}
        name={props.nameAndId}
        id={props.nameAndId}
        className={styles.inputWithLabelInside}
      />
      <label className={styles.labelInsideInput} htmlFor={props.nameAndId}>
        {props.labelText}
      </label>
    </div>
  );
}
