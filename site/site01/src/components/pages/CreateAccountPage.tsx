import styles from "./CreateAccountPage.module.css";
import Container from "../layout/Container";
import Input from "../forms/Input";
import Button from "../forms/Button";
import Header from "../layout/Header";
import { Link } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import SelectCountrys from "./../forms/SelectCountrys";

export default function CreateAccountPage() {
  const submitButtonStyle = {
    backgroundColor: "var(--cor3)",
    fontSize: "1.5em",
    cursor: "pointer",
  };

  const labelStyle = {
    fontSize: "1.2em",
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rptPassword, setRptPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [dataNasc, setDataNasc] = useState<any>("");
  const [nacionality, setNacionality] = useState<string>("Selecione sua nacionalidade...");
  const [listNations, setListNations] = useState([]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== rptPassword) {
      console.log("As senhas não coincidem!");
      return;
    }
    if (nacionality === "Selecione sua nacionalidade...") {
      console.log("Selecione sua nacionalidade!");
      return;
    }

    fetch("http://localhost:5163/api/eatspot/postuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        dataNasc: dataNasc,
        username: username,
        nacionality: nacionality,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(console.log(data)))
      .catch((err) => console.log(err));
  }

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
        data = data.filter((nation: any) => {
          return nation.name.common.length < 30;
        });
        setListNations(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Header />
      <Container customClass="flexForLoginAndRegister">
        <div className={styles.leftDivCreateAcc}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h1 className={styles.leftCreateAccTitle}>Criar Conta</h1>
            <div className={styles.leftFormContainer}>
              <div className={styles.inputContainer}>
                <Input
                  type="email"
                  name="email"
                  styleLabel={labelStyle}
                  labelText="Email: "
                  placeholder="Insira seu email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  stylePlaceholder={{
                    fontSize: "1em",
                  }}
                  customClass={"placeholderFormat"}
                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  type="password"
                  name="password"
                  labelText="Senha: "
                  placeholder="Insira sua senha..."
                  value={password}
                  styleLabel={labelStyle}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  stylePlaceholder={{
                    fontSize: "1em",
                  }}
                  customClass={"placeholderFormat"}
                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  type="password"
                  name="rptpassword"
                  labelText="Repita sua senha: "
                  placeholder="Insira novamente sua senha..."
                  value={rptPassword}
                  styleLabel={labelStyle}
                  onChange={(e) => setRptPassword(e.target.value)}
                  required
                  stylePlaceholder={{
                    fontSize: "1em",
                  }}
                  customClass={"placeholderFormat"}
                />
              </div>
            </div>
            <div className={styles.rightFormContainer}>
              <div className={styles.inputContainer}>
                <Input
                  type="date"
                  name="dateNasc"
                  labelText="Data de nascimento: "
                  styleLabel={labelStyle}
                  placeholder="Insira sua data de nascimento..."
                  value={dataNasc}
                  onChange={(e) => setDataNasc(e.target.value)}
                  required
                  stylePlaceholder={{
                    fontSize: "1.2em",
                  }}
                  customClass={"placeholderFormat"}
                />
              </div>
              <div className={styles.selectContainer}>
                <SelectCountrys
                  name="nacionality"
                  labelText="Nacionalidade: "
                  optionsList={listNations}
                  labelStyle={{
                    fontSize: "1.2em",
                    color: "white",
                  }}
                  selectedValue={nacionality}
                  setSelectedValue={setNacionality}
                  styleLabel={labelStyle}
                />
              </div>
              <div className={styles.inputContainer}>
                <Input
                  type="text"
                  name="username"
                  labelText="Nome de usuário: "
                  placeholder="Insira seu nome de usuário..."
                  value={username}
                  styleLabel={labelStyle}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  stylePlaceholder={{
                    fontSize: "1em",
                  }}
                  customClass={"placeholderFormat"}
                />
              </div>
            </div>
            <div className={styles.divButton}>
              <Button
                type="submit"
                buttonText="Criar conta"
                style={submitButtonStyle}
              />
            </div>
          </form>
        </div>
        <div className={styles.rightDivCreateAcc}>
          <p className={styles.rightDivText}>
            Se já possui uma conta, faça o seu <br /> login
          </p>
          <Link className={styles.rightDivLink} to="/login">
            Login
          </Link>
        </div>
      </Container>
    </>
  );
}
