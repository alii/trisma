import { parseModel } from "./parse-metdata";
import { Example } from "./example";
import { generateDMMF } from "./dmmf";

const model = parseModel(Example);

void generateDMMF({
  models: [model],
  enums: [],
}).then(console.log);
