import { Artist } from 'src/database/entities/artist.entity';
import { Track } from 'src/database/entities/track.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  year: number;
  @Column({ nullable: true, type: 'uuid' })
  artistId: string | null;
  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;
  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}
