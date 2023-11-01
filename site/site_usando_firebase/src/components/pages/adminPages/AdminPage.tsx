import { useState, useEffect } from "react";
import { getImageStorage } from "../../services/firebase/firebaseStorage";

interface Country {
  name: string;
  imgPath: string;
}

export default function AdminPage() {
  const [image, setImage] = useState<any>();
  const [modalToChangePhotoOpen, setModalToChangePhotoOpen] =
  useState<boolean>(true);

  async function getRecipeImage() {
    const response = await getImageStorage(
      "images/receitas/alessandro123/13/imagemPrincipal"
    );
    return response;
  }

  useEffect(() => {
    const teste = getRecipeImage().then((response) => {return response} );
  }, []);

  return (
    <div>

          <button onClick={() => {
            setModalToChangePhotoOpen(true);
          }}>abrir</button>
      <img src={image} alt="teste" />
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
