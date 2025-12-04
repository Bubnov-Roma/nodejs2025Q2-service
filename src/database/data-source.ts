import { config } from 'dotenv';
import { Album } from 'src/database/entities/album.entity';
import { Artist } from 'src/database/entities/artist.entity';
import { Favorite } from 'src/database/entities/favorite.entity';
import { Track } from 'src/database/entities/track.entity';
import { User } from 'src/database/entities/user.entity';
import { DataSource } from 'typeorm';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Artist, Album, Track, Favorite],
  migrations: [__dirname + '/migrations/**/*{ts,js}'],
  synchronize: false,
  logging: false,
});
