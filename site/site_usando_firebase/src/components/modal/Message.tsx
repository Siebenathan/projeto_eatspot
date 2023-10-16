import { useState, useEffect } from "react";
import styles from "./Message.module.css";

interface MessageProps {
  type: "error" | "success";
  message: string;
}

export default function Message(props: MessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!props.message) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [props.message]);

  return (
    <>
      {visible && (
        <div className={styles.backgroundStyle}>
          <div className={`${styles.message} ${styles[props.type]}`}>
            {props.message}
          </div>
        </div>
      )}
    </>
  );
}
