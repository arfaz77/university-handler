import { Context, Next } from "hono";
import fs from "fs";
import path from "path";

export const fileUploadMiddleware = async (c: Context, next: Next) => {
  const body = await c.req.parseBody();

  if (body.university_pdf && body.university_pdf instanceof File) {
    const file = body.university_pdf;
    const buffer = await file.arrayBuffer();
    const filePath = path.join(__dirname, "../uploads", file.name);

    fs.writeFileSync(filePath, Buffer.from(buffer));

    // ✅ Explicitly define filePath in context storage
    c.set("filePath", filePath as never); 
  }

  await next();
};
