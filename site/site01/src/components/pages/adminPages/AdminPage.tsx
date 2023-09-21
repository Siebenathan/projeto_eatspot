import Button from "../../forms/Button";

interface Country {
  name: string;
  imgPath: string;
}

export default function AdminPage() {
  async function handleSetCountry() {
    const countryData = await getCountrys();
    const backEndResponse = await setCountrysDatabase(countryData);
    console.log(backEndResponse);
  }

  async function getCountrys() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    let data = await response.json();
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
    return data.reduce((acc: Country[], valorAtual: any) => {
      acc.push({ name: valorAtual.name.common, imgPath: valorAtual.flags.png });
      return acc;
    }, []);
  }

  async function setCountrysDatabase(countryData: Country[]) {
    const response = await fetch(
      "http://localhost:5163/api/eatspot/admin/set/paises",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(countryData),
      }
    );
    return await response.json(); 
  }

  return (
    <div>
      <Button
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
        onClick={handleSetCountry}
      ></Button>
    </div>
  );
}
