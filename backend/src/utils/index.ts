import { customAlphabet } from "nanoid";

function generateRandomId(lenght: number) {
  const nanoid = customAlphabet("1234567890ABCDEFGHIJQLMNOPQRSTUVWXYZ", 10);
  const id = nanoid(lenght);
  return id;
}

export { generateRandomId };
