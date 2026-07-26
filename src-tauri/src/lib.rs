// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "Create Time Table",
            sql: "CREATE TABLE IF NOT EXISTS times (
            id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
            client_name TEXT NOT NULL,
            key TEXT UNIQUE NOT NULL,
            total_time INTEGER,
            current_time INTEGER DEFAULT 0,
            running INTEGER NOT NULL DEFAULT 0,
            order_index INTEGER UNIQUE NOT NULL,
            active INTEGER NOT NULL DEFAULT 1
            )",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            // Rebuilds `times` to drop the unused `active` column, drop the UNIQUE
            // constraint on `order_index` (re-keying a project has to move its index
            // onto a value another row is vacating), make `total_time` NOT NULL so
            // arithmetic can never hit NULL, and rename `current_time` to
            // `started_at` — it holds an epoch timestamp, not a duration.
            // Also adds `time_entries`, an append-only log so "End Day" no longer
            // discards the day's totals without a trace.
            //
            // DO NOT EDIT THE SQL BELOW. sqlx checksums each migration and refuses
            // to start if an applied one changes ("migration 2 was previously
            // applied but has been modified"). It has a known defect: `current_time`
            // is unquoted, so SQLite parses it as the CURRENT_TIME keyword and
            // writes an 'HH:MM:SS' string into started_at for a project that was
            // running at upgrade time. Migration 3 repairs that; fix it there, not
            // here.
            description: "Normalise times table and add time_entries history",
            sql: "CREATE TABLE times_new (
            id INTEGER PRIMARY KEY,
            client_name TEXT NOT NULL,
            key TEXT NOT NULL UNIQUE,
            total_time INTEGER NOT NULL DEFAULT 0,
            started_at INTEGER NOT NULL DEFAULT 0,
            running INTEGER NOT NULL DEFAULT 0,
            order_index INTEGER NOT NULL DEFAULT 0
            );

            INSERT INTO times_new (id, client_name, key, total_time, started_at, running, order_index)
            SELECT id, client_name, key, COALESCE(total_time, 0),
                   CASE WHEN running = 1 THEN COALESCE(current_time, 0) ELSE 0 END,
                   running, order_index
            FROM times;

            DROP TABLE times;
            ALTER TABLE times_new RENAME TO times;

            CREATE TABLE time_entries (
            id INTEGER PRIMARY KEY,
            client_name TEXT NOT NULL,
            key TEXT NOT NULL,
            hours REAL NOT NULL,
            total_time INTEGER NOT NULL,
            ended_at INTEGER NOT NULL
            );

            CREATE INDEX idx_time_entries_ended_at ON time_entries (ended_at);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            // Repairs the defect described on migration 2: a project running at
            // upgrade time ends up with an 'HH:MM:SS' string in started_at.
            // Left alone, the next stop coerces that text to 18 and banks roughly
            // fifty years against the project. Migration 2 dropped the column the
            // real start time came from, so it is unrecoverable — stop the clock
            // rather than guess at it. A no-op on any database that upgraded with
            // no timer running, which is the overwhelmingly common case.
            description: "Stop timers left with a non-integer start time",
            sql: "UPDATE times SET started_at = 0, running = 0
                  WHERE typeof(started_at) <> 'integer';",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:projecttracker.db", migrations)
            .build()
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
