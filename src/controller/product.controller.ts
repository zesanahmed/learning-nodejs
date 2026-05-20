import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  // get all products
  // /products => /products/1 => ['', "products","1"]`

  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log(`The id number is ${id}`);
  if (url === "/products" && method === "GET") {
    // const products = [
    //   {
    //     id: 1,
    //     name: "phone",
    //   },
    // ];
    try {
      const products = readProduct();
      return sendResponse(
        res,
        200,
        true,
        "Products retrived successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Products not found", error);
    }
    const products = readProduct();
    sendResponse(res, 200, true, "Products retrived successfully", products);
  } else if (method === "GET" && id !== null) {
    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);
      // console.log(product);
      if (!product) {
        return sendResponse(res, 404, false, "Product not found", products);
      }
      return sendResponse(
        res,
        200,
        true,
        "Product retrived successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Somethis went wrong", error);
    }
  } else if (method === "POST" && url === "/products") {
    // created product by post method
    const body = await parseBody(req);
    // console.log(body);
    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    products.push(newProduct);
    insertProduct(products);
    // console.log(products);
    // console.log(newProduct);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index);
    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product not found",
          data: null,
        }),
      );
    }
    products[index] = { id: products[index].id, ...body };
    insertProduct(products);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product updated successfully",
        data: products[index],
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product not found",
          data: null,
        }),
      );
    }
    products.splice(index, 1);
    insertProduct(products);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product delete successfully",
        data: null,
      }),
    );
  }
};
