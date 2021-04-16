import { readFileSync, existsSync } from "fs";
import { parse } from "java-parser";
import { visitor } from "./visitor.js";

if (!existsSync(process.argv?.[2])) {
  console.error("Java2dts: Must supply proper input file");
  process.exit(1);
}

let intext = readFileSync(process.argv[2], "utf8");

const cst = parse(intext);

let out = visitor.visit(cst);
console.log(out);
