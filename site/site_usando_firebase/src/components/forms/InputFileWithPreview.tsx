import styles from "./InputFileWithPreview.module.css";
import { useState } from "react";

interface InputFileWithPreviewProps {
  spanText: string;
  styleForPicture?: any;
  required?: boolean;
  setFile(file: any): void;
  imageFile: any;
  setImageUrl?(file: any): void;
}

export default function InputFileWithPreview(props: InputFileWithPreviewProps) {
  return (
    <label
      tabIndex={0}
      className={styles.picture}
      style={props.styleForPicture}
    >
      <input
        type="file"
        accept="image/*"
        className={styles.picture_input}
        required={props.required}
        onChange={(e: any) => {
          const inputTarget = e.target;
          const file = inputTarget.files[0];

          if (file) {
            if (props.setImageUrl) {
              props.setImageUrl(file);
            }

            const reader = new FileReader();

            reader.addEventListener("load", function (e: any) {
              const readerTarget = e.target;
              props.setFile(readerTarget.result);
            });

            reader.readAsDataURL(file);
          }
        }}
      />
      <span className={styles.picture_image}>
        {props.imageFile ? (
          <img src={props.imageFile} className={styles.picture_img}></img>
        ) : (
          props.spanText
        )}
      </span>
    </label>
  );
}
