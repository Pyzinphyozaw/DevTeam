import { DataSource } from 'typeorm';
import { IServerConfig } from './config';
import * as config from '../../server_config.json';
import { Roles } from '../components/roles/roles_entity';
import { Users } from '../components/users/users_entity';
import { Projects } from '../components/projects/projects_entity';
import { Tasks } from '../components/tasks/tasks_entity';
import { Comments } from '../components/comments/comments_entity';

export class DatabaseUtil {
  public server_config: IServerConfig = config as IServerConfig;
  public static dataSource: DataSource;

  constructor() {
    // Call an async initializer wrapper
    this.init();
  }

  private async init() {
    await this.connectDatabase();
  }

  private async connectDatabase() {
    try {
      const db_config = this.server_config.db_config;
      DatabaseUtil.dataSource = new DataSource({
        type: 'postgres',
        host: db_config.host,
        port: Number(db_config.port),
        username: db_config.username,
        password: db_config.password,
        database: db_config.dbname,
        entities: [Roles, Users, Projects, Tasks, Comments],
        synchronize: true,
        logging: false,
      });

      await DatabaseUtil.dataSource.initialize();
      console.log('Connected to the database successfully');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }
}
