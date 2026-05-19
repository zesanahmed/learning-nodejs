import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./src/database/db.json");
export const readProduct = () => {
  //   console.log(filePath);
  const products = fs.readFileSync(filePath, "utf-8");
  // console.log(JSON.parse(products));
  return JSON.parse(products);
};
export const insertProduct = (payLoad: any) => {
  console.log(JSON.stringify(payLoad));
  fs.writeFileSync(filePath, JSON.stringify(payLoad));
};
