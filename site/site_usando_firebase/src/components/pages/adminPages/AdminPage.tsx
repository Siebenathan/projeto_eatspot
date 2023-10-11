import { useEffect, useState } from "react";
import Button from "../../forms/Button";
import Modal from "../../modal/Modal";

interface Country {
  name: string;
  imgPath: string;
}

export default function AdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [modal, setModal] = useState<boolean>(true);

  return (
    <div style={{ height: "100vh" }}>
      <Modal
        type="erro"
        isOpen={modal}
        setIsOpen={() => {
          setModal(!modal);
        }}
        text="teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste,"
        title="TESTE"
      ></Modal>
    </div>
  );
}

/* <Button
buttonText="Setar os países no banco de dados"
type="button"
style={{
  backgroundColor: "green",
  color: "white",
  width: "500px",
  height: "200px",
  fontSize: "2em",
  cursor: "pointer",
}}
onClick={() => console.log("a")}
></Button> */
