import {
  Array,
  Default,
  Documentation,
  Field,
  ID,
  Model,
  Nullable,
  Unique,
  UpdatedAt,
} from "./decorators";

@Model()
export class Example {
  @ID()
  @Field()
  @Documentation("This is the ID of the row")
  @Default("now()")
  id!: string;

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
