import Header from "../layout/Header";
import styles from "./LoginPage.module.css";
import Container from "../layout/Container";
import { Link, useLocation } from "react-router-dom";
import Input from "../forms/Input";
import Button from "../forms/Button";
import { useState } from "react";
import { signIn } from "../services/firebase/firebaseAuth";
import useLocalStorage from "../hooks/useLocalStorage";
import Message from "../modal/Message";

export default function LoginPage() {
  const buttonSubmitStyle = {
    backgroundColor: "var(--cor3)",
    fontSize: "1.5em",
    cursor: "pointer",
  };

  const location = useLocation();
  const message = location.state?.message;
  const messageType = location.state?.type;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [value, setValue] = useLocalStorage("userId", "");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const userUid = await signIn(password, email);
    setValue(userUid);
  }

  return (
    <div className={styles.loginPageBody}>
      <Header />
      {message && (<Message message={message} type={messageType}></Message>)}
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
                autocomplete={true}
                placeholder="Insira seu email..."
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
            </div>
            <div className={styles.inputContainer}>
              <Input
                labelText="Senha: "
                type="password"
                name="password"
                autocomplete={true}
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
