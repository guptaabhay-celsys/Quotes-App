import {
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Entity,
    JoinColumn,
  } from "typeorm";
  import { Users } from "./userEntity";
  
  @Entity("quotes")
  export class Quotes {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 1000 })
    name!: string;
  
    @ManyToOne(() => Users, (user) => user.quotes)
    @JoinColumn({ name: "user_id" })
    user!: Users;
      created_at: any;
  }
  