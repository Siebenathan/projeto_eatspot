import styles from "./ModalToPutImage.module.css";
import { useEffect, useState } from "react";
import Button from "../forms/buttons/Button";
import InputFileWithPreview from "../forms/inputs/InputFileWithPreview";

export interface ModalToPutImageProps {
  title: string;
  text: string;
  isOpen: boolean;
  setImageFileUrl(photo: any): void;
  type: "erro" | "sucesso" | "informacao";
  setIsOpen(): any;
  secondButtonFunction(): any;
  textSecondButton: string;
  styleSecondButton: any;
}

export default function ModalToPutImage(props: ModalToPutImageProps) {
  const [modalStyle, setModalStyle] = useState<any>({});
  const [imageFile, setImageFile] = useState<any>();

  useEffect(() => {
    if (props.type === "erro") {
      setModalStyle({ backgroundColor: "red", color: "white" });
    } else if (props.type === "sucesso") {
      setModalStyle({ backgroundColor: "green", color: "white" });
    } else if (props.type === "informacao") {
      setModalStyle({ backgroundColor: "var(--cor5)", color: "white" });
    }
  }, [props.type]);

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
            <form className={styles.formInsertImage}>
              <InputFileWithPreview
                imageFile={imageFile}
                setFile={setImageFile}
                spanText="Clique aqui para inserir uma imagem..."
                setImageUrl={props.setImageFileUrl}
              />
            </form>
            <div className={styles.divModalButtons}>
              <div>
                <Button
                  onClick={() => {
                    if(imageFile) {
                        props.secondButtonFunction();
                        props.setIsOpen();
                        setImageFile(undefined);
                    }
                  }}
                  buttonText={props.textSecondButton}
                  type="button"
                  style={props.styleSecondButton}
                ></Button>
              </div>
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
