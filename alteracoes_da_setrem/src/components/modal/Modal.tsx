import styles from "./Modal.module.css";
import Button from "../forms/buttons/Button";
import { useState, useEffect } from "react";

export interface ModalProps {
  title: string;
  text: string;
  isOpen: boolean;
  type: "erro" | "sucesso" | "informacao";
  setIsOpen(): any;
  secondButtonFunction?(): any;
  textSecondButton?: string;
  styleSecondButton?: any;
}

export default function Modal(props: ModalProps) {
  const [modalStyle, setModalStyle] = useState<any>({});
  const [textSecondButton, setTextSecondButton] = useState<string>();

  useEffect(() => {
    if (props.type === "erro") {
      setModalStyle({ backgroundColor: "red", color: "white" });
    } else if (props.type === "sucesso") {
      setModalStyle({ backgroundColor: "green", color: "white" });
    } else if (props.type === "informacao") {
      setModalStyle({ backgroundColor: "var(--cor5)", color: "white" })
    }
    if (props.textSecondButton) {
      setTextSecondButton(props.textSecondButton);
    } else {
      setTextSecondButton("");
    }
  }, [props.type, props.textSecondButton]);

  if (props.isOpen) { 
    return (
      <>
        <div className={styles.backgroundStyle}>
          <div className={styles.mainModal}>
            <div className={styles.divModalTitle} style={modalStyle}>
              <h2>{props.title}</h2>
            </div>
            <div className={styles.divModalText}>
              <p>{props.text}</p>
            </div>
            <div className={styles.divModalButtons}>
              {textSecondButton != "" && (
                <div>
                  <Button
                    onClick={() => {
                      if (props.secondButtonFunction) {
                        props.secondButtonFunction();
                      }
                    }}
                    buttonText={props.textSecondButton || ""}
                    type="button"
                    style={props.styleSecondButton}
                  ></Button>
                </div>
              )}

              <div className={styles.buttonToCloseModal}>
                <Button
                  onClick={() => {
                    props.setIsOpen();
                  }}
                  buttonText="Fechar"
                  type="button"
                  style={{
                    backgroundColor: "red",
                    cursor: "pointer",
                    padding: "10px 20px",
                    color: "white",
                    borderRadius: "5px",
                  }}
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
