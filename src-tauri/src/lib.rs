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
            current_time INTEGER,
            running INTEGER NOT NULL DEFAULT 0,
            order_index INTEGER UNIQUE NOT NULL,
            active INTEGER NOT NULL DEFAULT 1
            )",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:projecttracker-v2.db", migrations)
            .build()
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
