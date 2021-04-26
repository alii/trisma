import { parseModel } from "./metadata";
import { Example } from "./example";
import { generateDMMF } from "./dmmf";

const model = parseModel(Example);

void generateDMMF({
  models: [model],
  enums: [],
}).then((dmmf) => {
  console.log(dmmf.datamodel.models);
});
