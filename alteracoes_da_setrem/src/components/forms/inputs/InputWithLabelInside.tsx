import { unescape } from "querystring";
import styles from "./InputWithLabelInside.module.css";
import { useState, useEffect } from "react";
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";

interface InputWithLabelInsideProps {
  nameAndId: string;
  type: "text" | "password" | "email" | "date";
  labelText: string;
  value: any;
  setValue(value: any): void;
  errorText?: string;
  setErrorText?(inputErros: any): void;
  required?: boolean;
  lockIconForPassword?: boolean;
}

export default function InputWithLabelInside(props: InputWithLabelInsideProps) {
  type typeUndefined = "" | undefined;
  const [labelStyle, setLabelStyle] = useState<any>({});
  const [inputStyle, setInputStyle] = useState<any>({});
  const [isPasswordLocked, setIsPasswordLocked] = useState<boolean>(true);

  useEffect(() => {
    if (props.type == "date") {
      setLabelStyle({
        transform: "translateY(-29px)",
        fontSize: "0.8em",
        color: "var(--cor7)",
      });
      return;
    }
    if (props.value) {
      setLabelStyle({
        transform: "translateY(-24px)",
        fontSize: "0.8em",
        color: "cornflowerblue",
      });
      setInputStyle({
        borderBottom: "2px solid cornflowerblue",
      });
    }
  }, []);

  return (
    <div className={styles.divInputWithLabelInside}>
      <div className={styles.divInputAndLabel}>
        <input
          required={props.required}
          style={inputStyle}
          type={isPasswordLocked ? props.type : "text"}
          name={props.nameAndId}
          value={props.value}
          id={props.nameAndId}
          className={`${styles.inputWithLabelInside} ${
            props.lockIconForPassword ? styles.width85percent : ""
          }`}
          onChange={(e: any) => props.setValue(e.target.value)}
          onFocus={() => {
            if (props.type == "date") {
              setInputStyle({ borderBottom: "2px solid cornflowerblue" });
              setLabelStyle({
                transform: "translateY(-29px)",
                fontSize: "0.8em",
                color: "cornflowerblue",
              });
              return;
            }
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
            if (!props.value) {
              if (props.type == "date") {
                setInputStyle({ borderBottom: "2px solid cornflowerblue" });
                setLabelStyle({
                  transform: "translateY(-29px)",
                  fontSize: "0.8em",
                  color: "cornflowerblue",
                });
                return;
              }
              setInputStyle({});
              setLabelStyle({});
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
        {props.lockIconForPassword && (
          <button
            className={styles.iconButtonMain}
            onClick={() => {
              setIsPasswordLocked(!isPasswordLocked);
            }}
            type="button"
          >
            {isPasswordLocked ? (
              <IoIosLock className={styles.lockIcon} />
            ) : (
              <IoIosUnlock className={styles.lockIcon} />
            )}
          </button>
        )}
      </div>
      {props.errorText != "" && props.errorText != undefined && (
        <div className={styles.divError}><span className={styles.errorSpan}>{props.errorText}</span></div>
      )}
    </div>
  );
}
