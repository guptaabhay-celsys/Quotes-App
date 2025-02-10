import {
    PrimaryGeneratedColumn,
    OneToMany,
    Column,
    Entity,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Quotes } from "./quoteEntity";
  
  @Entity("users")
  @Unique(["email"])
  export class Users {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 100 })
    firstName!: string;

    @Column({ type: "varchar", length: 100 })
    lastName!: string;
  
    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;
  
    @Column({ type: "varchar", length: 255 })
    password!: string;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;
  
    @UpdateDateColumn({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    })
    updated_at!: Date;
  
    @OneToMany(() => Quotes, (quote) => quote.user)
    quotes!: Quotes[];
  }
  