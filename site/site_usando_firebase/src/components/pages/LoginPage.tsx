import Header from "../layout/Header";
import styles from "./LoginPage.module.css";
import Container from "../layout/Container";
import { Link } from "react-router-dom";
import Input from "../forms/Input";
import Button from "../forms/Button";
import { useState } from "react";

export default function LoginPage() {
  const buttonSubmitStyle = {
    backgroundColor: "var(--cor3)",
    fontSize: "1.5em",
    cursor: "pointer",
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleSubmit(e: any) {
    e.preventDefault();
    //TO DO
  }

  return (
    <div className={styles.loginPageBody}>
      <Header />
      <Container customClass="flexForLoginAndRegister">
        <div className={styles.leftDivLogin}>
          <p className={styles.leftDivLoginText}>
            Se ainda não <br />
            possui uma <br />
            conta crie uma
          </p>
          <Link className={styles.leftDivLoginLink} to="/criar-conta">
            Criar Conta
          </Link>
        </div>
        <div className={styles.rightDivLogin}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h1 className={styles.rightDivTitle}>Login</h1>
            <div className={styles.inputContainer}>
              <Input
                labelText="Email: "
                type="email"
                name="email"
                value={email}
                placeholder="Insira seu email..."
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
            </div>
            <div className={styles.inputContainer}>
              <Input
                labelText="Senha: "
                type="password"
                name="password"
                value={password}
                placeholder="Insira sua senha..."
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
            </div>
            <div className={styles.divButton}>
              <Button
                buttonText="Login"
                type="submit"
                style={buttonSubmitStyle}
              />
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
