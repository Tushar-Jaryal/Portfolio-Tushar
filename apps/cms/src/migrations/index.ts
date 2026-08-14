import * as migration_20260808_012435_initial from './20260808_012435_initial';
import * as migration_20260808_030053_add_last_link_requested_at from './20260808_030053_add_last_link_requested_at';

export const migrations = [
  {
    up: migration_20260808_012435_initial.up,
    down: migration_20260808_012435_initial.down,
    name: '20260808_012435_initial',
  },
  {
    up: migration_20260808_030053_add_last_link_requested_at.up,
    down: migration_20260808_030053_add_last_link_requested_at.down,
    name: '20260808_030053_add_last_link_requested_at'
  },
];
