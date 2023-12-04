import styles from "./Loading.module.css";

interface LoadingProps {
  styleSizeOfTheLoading?: any;
}

export default function Loading(props: LoadingProps) {
  return (
    <div
      className={styles.loader_circle}
      style={props.styleSizeOfTheLoading}
    ></div>
  );
}
