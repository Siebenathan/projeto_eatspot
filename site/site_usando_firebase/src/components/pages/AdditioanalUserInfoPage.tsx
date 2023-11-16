import styles from "./AdditioanalUserInfoPage.module.css";
import EatSpotImage from "../../img/EatSpot-semfundo_com_chapeu_de_cozinheiro.png";
import { FcCalendar, FcGlobe, FcDecision } from "react-icons/fc";
import Footer from "../layout/Footer";
import SelectCountrys from "../forms/SelectCountrys";
import Header from "../layout/Header";
import Container from "../layout/Container";
import { useState, useEffect } from "react";

export default function AdditionalUserInfoPage() {
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [listNations, setListNations] = useState<any>();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a: any, b: any) => {
          const nomeA = a.name.common;
          const nomeB = b.name.common;

          if (nomeA < nomeB) {
            return -1;
          }
          if (nomeA > nomeB) {
            return 1;
          }

          return 0;
        });
        // data = data.filter((nation: any) => {
        //   return nation.name.common.length < 30;
        // });
        setListNations(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <Container customClass={"flexMiddleCol"}>
        <h1 className={styles.additionalInformationTitle}>
          Informações adicionais da conta
        </h1>
        <form action="" className={styles.additionalInfoForm}>
          <div className={styles.normalDivForm}>
            <FcDecision className={styles.userDoubtIcon} />
            <label htmlFor="username">Insira seu nome de usuário:</label>
            <input type="text" id={"username"} name={"username"} required />
          </div>
          <div className={styles.normalDivForm}>
            <FcCalendar className={styles.calendarIcon} />
            <label htmlFor="userBornDate">Insira sua data de nascimento:</label>
            <input
            placeholder="Insira o nome de usuário..."
              type="date"
              id={"userBornDate"}
              name={"userBornDate"}
              required
            />
          </div>
          <div className={styles.divFormNations}>
            {listNations && (
              <SelectCountrys
                name="nacionality"
                labelText="Nacionalidade: "
                optionsList={listNations}
                labelStyle={{
                  fontSize: "1.3em",
                  textAlign: "center",
                  color: "white",
                  paddingBottom: "10px"
                }}
                selectedValue={selectedCountry}
                setSelectedValue={setSelectedCountry}
              />
            )}
          </div>
        </form>
      </Container>
    </>
  );
}
