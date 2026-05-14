import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('waterplantt.db');

export default db;