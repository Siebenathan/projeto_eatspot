import styles from "./PerfilPage.module.css";
import Container from "../layout/Container";
import SmallFoodContainer from "../eatspotcomponents/SmallFoodContainer";
import PerfilFoodContainer from "../eatspotcomponents/PerfilFoodContainer";

export default function PerfilPage() {
  const names = [
    "Macarronada de Sardinha",
    "Maria",
    "Matheus",
    "João",
    "Wesley",
    "Bernardo",
    "Luisa",
    "Luiz",
    "Pedro",
  ];
  let key = 0;
  const urlFood = "https://source.unsplash.com/featured/300x300?food";

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        background: "var(--cor2)",
        boxShadow: "#00000014 0px 9px 20px 10px",
      }}
    >
      <div className={styles.divPerfilInformation}>
        <h1 className={styles.divPerfilTitleUserName}>Cristiano Ronaldo</h1>
        <img
          className={styles.divPerfilInformationImage}
          src="https://source.unsplash.com/featured/200x200?person"
          alt="user image"
        />
        <h3>
          Receitas postadas: {" "}
          <span className={styles.divPerfilQtdeInformation}>300</span>
        </h3>
        <h3>
          Curtidas no perfil:{" "}
          <span className={styles.divPerfilQtdeInformation}>300</span>
        </h3>
      </div>
      <div className={styles.gridContainerFood}>
        {names.map((name) => {
          key++;
          return (
            <PerfilFoodContainer
              authorName={name}
              imageFoodUrl={urlFood}
              likesAmount={300}
              recipeName={name}
              key={key}
            />
          );
        })}
      </div>
    </Container>
  );
}
