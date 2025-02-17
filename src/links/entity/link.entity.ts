import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'links',
})
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;
}
