import type { ServerResponse } from "node:http";

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any,
) => {
  const response = {
    statusCode,
    success,
    message,
    data,
  };
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(response));
};
