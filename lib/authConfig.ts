export const JWT_SECRET = process.env.JWT_SECRET ?? "";

console.log("JWT_SECRET accedido desde authConfig:", JWT_SECRET);


export function getJwtSecret(): string {
  if (!JWT_SECRET || JWT_SECRET.trim() === "") {
    throw new Error("JWT_SECRET no definido en entorno");
  }

  console.log("JWT_SECRET validado desde getJwtSecret:", JWT_SECRET);
  return JWT_SECRET;
}