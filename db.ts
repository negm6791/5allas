import Dexie, { type EntityTable } from 'dexie';
import { Task, Project } from './types';

const db = new Dexie('5allasDB_v5_2') as Dexie & {
    tasks: EntityTable<Task, 'id'>;
    projects: EntityTable<Project, 'id'>;
};

db.version(1).stores({
    tasks: 'id, priority, energyTag, isToday, completed, projectId',
    projects: 'id, order'
});

export { db };
