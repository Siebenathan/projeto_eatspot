import styles from "./InputWithLabelInside.module.css";
import { useState } from "react";

interface InputWithLabelInsideProps {
  nameAndId: string;
  type: "text" | "password" | "email";
  labelText: string;
  value: any;
  setValue(value: any): void;
  required?: boolean;
}

export default function InputWithLabelInside(props: InputWithLabelInsideProps) {
  const [labelStyle, setLabelStyle] = useState<any>({});
  const [inputStyle, setInputStyle] = useState<any>({});
  const [isTextInside, setIsTextInside] = useState<boolean>();

  return (
    <div className={styles.divInputWithLabelInside}>
      <input
        required={props.required}
        style={inputStyle}
        type={props.type}
        name={props.nameAndId}
        id={props.nameAndId}
        className={styles.inputWithLabelInside}
        onChange={(e: any) => props.setValue(e.target.value)}
        onFocus={() => {
          setLabelStyle({
            transform: "translateY(-24px)",
            fontSize: "0.8em",
            color: "cornflowerblue",
          });
          setInputStyle({
            borderBottom: "2px solid cornflowerblue",
          });
        }}
        onBlur={() => {
          console.log(props.value);
          if (!props.value) {
            setLabelStyle({});
            setInputStyle({});
          }
        }}
      />
      <label
        className={styles.labelInsideInput}
        htmlFor={props.nameAndId}
        style={labelStyle}
      >
        {props.labelText}
      </label>
    </div>
  );
}
