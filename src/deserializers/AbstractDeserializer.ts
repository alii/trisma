import { DMMF } from "@prisma/generator-helper";

export abstract class AbstractDeserializer<
  T extends DMMF.Model | DMMF.SchemaEnum
> {
  public abstract process(model: T): string;
}
