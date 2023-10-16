import Container from "../layout/Container";
import styles from "./RecipePage.module.css";
import {FaRegClock} from 'react-icons/fa';

export default function RecipePage() {
  const urlFood = "https://source.unsplash.com/featured/800x600?food"

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        padding: "50px 0px",
      }}
    >
      <h1 className={styles.recipeTitle}>Bolo de chocolate</h1>
      <div className={styles.recipeImageDiv}>
        <img src={urlFood} alt="sla" />
      </div>
      <div>
        
        <h2><FaRegClock />60min</h2>
      </div>
    </Container>
  );
}
