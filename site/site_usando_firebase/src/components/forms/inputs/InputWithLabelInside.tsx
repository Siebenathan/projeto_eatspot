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
  required?: boolean;
  lockIconForPassword?: boolean;
}

export default function InputWithLabelInside(props: InputWithLabelInsideProps) {
  const [labelStyle, setLabelStyle] = useState<any>({});
  const [inputStyle, setInputStyle] = useState<any>({});
  const [isPasswordLocked, setIsPasswordLocked] = useState<boolean>(true);

  useEffect(() => {
    console.log(props.type);
    if (props.type == "date") {
      setLabelStyle({
        transform: "translateY(-24px)",
        fontSize: "0.8em",
        color: "var(--cor7)",
      });
    }
  }, []);

  return (
    <>
      <div className={styles.divInputWithLabelInside}>
        <input
          required={props.required}
          style={inputStyle}
          type={isPasswordLocked ? props.type : "text"}
          name={props.nameAndId}
          id={props.nameAndId}
          className={`${styles.inputWithLabelInside} ${
            props.lockIconForPassword ? styles.width85percent : ""
          }`}
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
            if (!props.value) {
              if (props.type == "date") {
                setInputStyle({});
                setLabelStyle({
                  transform: "translateY(-24px)",
                  fontSize: "0.8em",
                  color: "black",
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
    </>
  );
}
