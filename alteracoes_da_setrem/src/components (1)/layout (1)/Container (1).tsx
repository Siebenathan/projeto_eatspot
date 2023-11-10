import styles from "./Container.module.css";

export default function Container(props: any) {
  return (
    <div
      className={`${styles.container} ${styles[props.customClass]}`}
      style={props.styleContainer}
    >
      {props.children}
    </div>
  );
}
