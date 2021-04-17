import { readFileSync, existsSync } from "fs";
import { parse } from "java-parser";
import { visitor } from "./visitor.js";

if (!existsSync(process.argv?.[2])) {
  console.error("Java2dts: Must supply proper input file");
  process.exit(1);
}

let intext = readFileSync(process.argv[2], "utf8");

// TODO: For kotlin, the decompilation will name the setter arguments "<set-?>" which is an invalid name(not to mention very helpful)
// so for now let's just replace it with "arg0" and eventually can derive an algorithm to give them apt names.
intext = intext.replace(/<set-\?>/g, "arg0");

const cst = parse(intext);

let out = visitor.visit(cst);
console.log(out);
