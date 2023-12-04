import { getDataFromCollection } from "../services/firebase/firebaseFirestore";

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
  const hasNumber = new RegExp(/^(?=.*\d)\d{1,}$/);
  const hasSpecialChar = new RegExp(/^(?=.*\W)\W{1,}$/);
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
}
