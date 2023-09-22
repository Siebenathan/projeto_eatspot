import { useEffect, useState } from "react";
import Button from "../../forms/Button";
import { getUsuarios, postUser } from "../../services/firebase";

interface Country {
  name: string;
  imgPath: string;
}

export default function AdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    getUsuarios()
      .then((users) => setUsers(users))
      .catch((err) => console.log(err));
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    await postUser({ name: name, email: email });
    getUsuarios()
      .then((users) => setUsers(users))
      .catch((err) => console.log(err));
  }

  // async function handleSetCountry() {
  //   const countryData = await getCountrys();
  //   const backEndResponse = await setCountrysDatabase(countryData);
  //   console.log(backEndResponse);
  // }

  // async function getCountrys() {
  //   const response = await fetch("https://restcountries.com/v3.1/all");
  //   let data = await response.json();
  //   data.sort((a: any, b: any) => {
  //     const nomeA = a.name.common;
  //     const nomeB = b.name.common;

  //     if (nomeA < nomeB) {
  //       return -1;
  //     }
  //     if (nomeA > nomeB) {
  //       return 1;
  //     }

  //     return 0;
  //   });
  //   return data.reduce((acc: Country[], valorAtual: any) => {
  //     acc.push({ name: valorAtual.name.common, imgPath: valorAtual.flags.png });
  //     return acc;
  //   }, []);
  // }

  // async function setCountrysDatabase(countryData: Country[]) {
  //   const response = await fetch(
  //     "http://localhost:5163/api/eatspot/admin/set/paises",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(countryData),
  //     }
  //   );
  //   return await response.json();
  // }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Insira seu nome..."
          value={name}
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          required
        />
        <input
          type="text"
          placeholder="Insira seu email..."
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
          required
        />
        <br />
        <button type="submit">Criar conta</button>
      </form>
      <div>
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>
              Nome: {user.name} || Email: {user.email}
            </li>
          ))}
        </ul>
      </div>
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
