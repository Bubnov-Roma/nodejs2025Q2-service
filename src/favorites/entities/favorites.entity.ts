import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  entityId: string;
  @Column({ type: 'varchar', length: 20 })
  entityType: 'artist' | 'album' | 'track';
}
