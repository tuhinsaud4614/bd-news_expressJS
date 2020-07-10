import { join } from "path";

export const dataFilePath = join(__dirname, "../..", "data.json");
export const rootPath = join(__dirname, "../..");

export const STATIC_PATHNAME = `${process.env.HOST || "localhost"}:${process.env.PORT || "8000"}`

