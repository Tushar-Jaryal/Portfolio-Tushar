import * as migration_20260808_012435_initial from './20260808_012435_initial';
import * as migration_20260808_030053_add_last_link_requested_at from './20260808_030053_add_last_link_requested_at';
import * as migration_20260815_221355_add_categories_table_drop_old_category from './20260815_221355_add_categories_table_drop_old_category';
import * as migration_20260815_222028_add_category_relationship from './20260815_222028_add_category_relationship';
import * as migration_20260907_200500_add_posts_drafts from './20260907_200500_add_posts_drafts';

export const migrations = [
  {
    up: migration_20260808_012435_initial.up,
    down: migration_20260808_012435_initial.down,
    name: '20260808_012435_initial',
  },
  {
    up: migration_20260808_030053_add_last_link_requested_at.up,
    down: migration_20260808_030053_add_last_link_requested_at.down,
    name: '20260808_030053_add_last_link_requested_at',
  },
  {
    up: migration_20260815_221355_add_categories_table_drop_old_category.up,
    down: migration_20260815_221355_add_categories_table_drop_old_category.down,
    name: '20260815_221355_add_categories_table_drop_old_category',
  },
  {
    up: migration_20260815_222028_add_category_relationship.up,
    down: migration_20260815_222028_add_category_relationship.down,
    name: '20260815_222028_add_category_relationship',
  },
  {
    up: migration_20260907_200500_add_posts_drafts.up,
    down: migration_20260907_200500_add_posts_drafts.down,
    name: '20260907_200500_add_posts_drafts',
  },
];
