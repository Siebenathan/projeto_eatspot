import { getDataFromCollection } from "../services/firebase/firebaseFirestore";

export const yearsLimit = -120;
export const minimumYear = -10;

export function verifyUserName(username: string) : "O nome de usuário deve ter no minimo 10 caracteres" | "O nome de usuário deve ter no máximo 30 caracteres" | "Certo" {
  if(username.length < 10) {
    return "O nome de usuário deve ter no minimo 10 caracteres";
  }
  if(username.length > 30) {
    return "O nome de usuário deve ter no máximo 30 caracteres";
  }
  return "Certo";
}

export async function verifyIfNameExist(username: string) : Promise<"Um usuário já possui este nome" | "Certo"> {
  const verifyIfNameExist = await getDataFromCollection(
    "users",
    "name",
    username
  );

  if (!verifyIfNameExist.empty) {
    return "Um usuário já possui este nome";
  }

  return "Certo";
}

export function verifyPassword(password: string) {
  const hasNumber = new RegExp(/\d/);
  const hasSpecialChar = new RegExp(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
  if (password.length < 8) {
    return "A senha precisa ter mais de 8 caracteres";
  }
  if (password.length > 30) {
    return "A senha pode ter no máximo 30 caracteres";
  }
  if (!hasNumber.test(password)) {
    return "A senha precisa ter pelo menos um número";
  }
  if (!hasSpecialChar.test(password)) {
    return "A senha precisa ter um caracter especial";
  }
  return "Certo";
}

export function verifyDate(dateString: string): string {

  const dateSplit = dateString.split("-").reverse();
  const year = parseInt(dateSplit[2]);

  const currentYear = new Date().getFullYear();

  if(year > currentYear) {
    return `O ano está acima de ${currentYear}`;
  }

  if(year < currentYear + yearsLimit) {
    return `O ano precisa estar acima de ${currentYear + yearsLimit}`;
  }

  if(year > currentYear + minimumYear) {
    return `O ano precisa estar abaixo ou igual a ${currentYear + minimumYear}`;
  }

  return "Certo";
}