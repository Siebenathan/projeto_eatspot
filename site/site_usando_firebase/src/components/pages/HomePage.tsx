import styles from "./HomePage.module.css";
import Container from "../layout/Container";
import SearchInput from "../forms/SearchInput";
import BigFoodContainer from "../eatspotcomponents/BigFoodContainer";
import SmallFoodContainer from "../eatspotcomponents/SmallFoodContainer";
import InviteToAction from "../eatspotcomponents/InviteToAction";
import BigSearchContainer from "../eatspotcomponents/searchRecipes/BigSearchContainer";

export default function HomePage() {
  const listaNomes = [
    "Alessandro",
    "João",
    "Matheus",
    "Luisa",
    "Marcela",
    "Luiz",
    "Wesley",
    "Marina",
  ];

  let contador = 0;

  const url = "https://source.unsplash.com/featured/600x400?food";
  const url2 = "https://source.unsplash.com/featured/300x250?food";

  return (
    <main>
      <BigSearchContainer />
      <Container customClass="flexMiddleCol">
        <div className={styles.bigFoodContainer}>
          <BigFoodContainer
            authorName="Alessandro"
            imageUrl={url}
            likesAmount={100}
            recipeName="Salada monstra"
          ></BigFoodContainer>
          <BigFoodContainer
            authorName="Alessandro"
            imageUrl={url}
            likesAmount={100}
            recipeName="Salada Monstra"
          ></BigFoodContainer>
        </div>
        <div className={styles.inviteToActionContainer}>
          <InviteToAction />
        </div>
        <div className={styles.mostLikedPostsContainer}>
          <h2>Receitas mais curtidas da comunidade</h2>
          <div className={styles.mostLikedPostsList}>
            {listaNomes.map((item) => {
              contador = contador + 1;
              return (
                <SmallFoodContainer
                  authorName={item}
                  recipeName={item}
                  imageUrl={url2}
                  likesAmount={100}
                  key={contador}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </main>
  );
}
