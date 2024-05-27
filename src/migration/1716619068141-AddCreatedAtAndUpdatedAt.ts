import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCreatedAtAndUpdatedAt1716619068141
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("users", [
      new TableColumn({
        name: "createdAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
    ]);
    await queryRunner.addColumns("comments", [
      new TableColumn({
        name: "createdAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
    ]);
    await queryRunner.addColumns("posts", [
      new TableColumn({
        name: "createdAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
      new TableColumn({
        name: "updatedAt",
        type: "timestamp",
        default: "now()",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "createdAt");
    await queryRunner.dropColumn("users", "updatedAt");

    await queryRunner.dropColumn("posts", "createdAt");
    await queryRunner.dropColumn("posts", "updatedAt");

    await queryRunner.dropColumn("comments", "createdAt");
    await queryRunner.dropColumn("comments", "updatedAt");
  }
}
