import {
  Array,
  Default,
  Documentation,
  Field,
  ID,
  Model,
  ModelDocumentation,
  Nullable,
  Unique,
  UpdatedAt,
  generateSchema,
  parseModel,
} from "./src";

@Model()
@ModelDocumentation("Documentation")
export class Example {
  @ID()
  @Field()
  @Documentation("This is the ID of the row")
  @Default("now()")
  id!: string;

  @Field()
  looskie!: boolean;

  @Field()
  @Nullable()
  @Array(String)
  names?: string[];

  @Field()
  created_at!: Date;

  @Field()
  @UpdatedAt()
  updated_at!: Date;

  @Field("Boolean")
  @Default(true)
  @Unique()
  count!: boolean;
}

const model = parseModel(Example);

void generateSchema({
  models: [model],
  enums: [],
}).then((schema) => {
  console.log(schema);
});
