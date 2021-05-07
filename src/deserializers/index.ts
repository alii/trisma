import { DMMF } from "@prisma/generator-helper";
import { Model } from "./model";

const modelDeserializer = new Model();

export function deserialize(modelOrEnum: DMMF.Model | DMMF.DatamodelEnum) {
  if ("fields" in modelOrEnum) {
    return modelDeserializer.process(modelOrEnum);
  } else {
    throw new Error("Enums are not yet supported.");
  }
}
