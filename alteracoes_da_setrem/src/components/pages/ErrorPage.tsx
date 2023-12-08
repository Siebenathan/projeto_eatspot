import Header from "../layout/Header";
import styles from "./ErrorPage.module.css";
import Container from "../layout/Container";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stateError, setStateError] = useState<number>();
  const [messageError, setMessageError] = useState<string>();
  const errorType = location.state?.errorType;
  const message = location.state?.message;

  useEffect(() => {
    if (errorType) {
      setStateError(errorType);
      setMessageError(message);
      return;
    }
    navigate("/");
  }, []);

  return (
    <>
      <Header />
      <Container>
        <div className={styles.mainDivError}>
          <h1>Error {stateError}</h1>
          <p>{message}</p>
          <div className={styles.divReturnHome}>
              <button onClick={() => {
                navigate("/");
              }}>
                  <FaLongArrowAltLeft className={styles.arrowLeftIcon} />
              </button>
              <p>Voltar para a home</p>
          </div>
        </div>
      </Container>
    </>
  );
}
