import styles from './PerfilFoodContainer.module.css';

interface PerfilFoodContainerProps {
    recipeName: string;
    imageFoodUrl: string;
    authorName: string;
    likesAmount: number;
}

export default function PefilFoodContainer(props: PerfilFoodContainerProps) {
  return (
    <div className={styles.mainContainer}>
      <img className={styles.imgFood} src={props.imageFoodUrl} alt="food image" />
      <div className={styles.textInsideImg}><p>{props.recipeName}</p></div>
    </div>
  );
}
