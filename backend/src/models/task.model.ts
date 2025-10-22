import { DataTypes, Model, Sequelize } from "sequelize";

export class Task extends Model {
  public id!: number;
  public titulo!: string;
  public descripcion!: string;
  public estado!: "pendiente" | "completada";
}

export const initTaskModel = (sequelize: Sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      titulo: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      descripcion: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [5, 255],
        },
      },
      estado: {
        type: DataTypes.ENUM("pendiente", "completada"),
        defaultValue: "pendiente",
        allowNull: false,
      },
    },
    {
      tableName: "tasks",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate: (task) => {
          task.titulo = task.titulo.trim();
        },
        beforeUpdate: (task) => {
          task.titulo = task.titulo.trim();
        },

        afterCreate: (task) => {
          console.log(`Tarea creada: ${task.titulo}`);
        },
        afterUpdate: (task) => {
          console.log(`Tarea actualizada: ${task.titulo}`);
        },
        afterDestroy: (task) => {
          console.log(`Tarea eliminada: ${task.titulo}`);
        },
      },
      sequelize,
    }
  );
};
