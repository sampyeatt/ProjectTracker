# ProjectTracker

A small desktop time tracker. Bind up to 16 clients to the function keys F9–F24,
press a key to switch the clock to that client, and close out the day with a
rounded, billable summary.

Built with Tauri 2, React 19 and SQLite.

## How it works

- One project can be running at a time; starting another banks the elapsed time
  on the previous one in the same SQL statement, so the two can't disagree.
- Time is only ever accumulated by the database, from the timestamp on the row.
- **End Day** shows each client's billable hours — the first 5 minutes are
  treated as unbilled setup, and the remainder is rounded up to the next half
  hour. Confirming appends the day to the `time_entries` table before the running
  totals are cleared, so a closed-out day is always recoverable.

## Development

```sh
npm install
npm run tauri dev
```

| Command | What it does |
| --- | --- |
| `npm run tauri dev` | Run the app with hot reload |
| `npm run tauri build` | Produce installers in `src-tauri/target/release/bundle` |
| `npm run lint` | ESLint over `src` |
| `npm test` | Vitest unit tests |
| `npm run build` | Type-check and bundle the frontend only |

Requires the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for
your platform.

### AppImage bundling on Arch

`npm run tauri build` fails at the AppImage step on Arch-based distros:

```
strip: unknown type [0x13] section `.relr.dyn'
failed to bundle project: `failed to run linuxdeploy`
```

`linuxdeploy` carries its own `strip` from a much older binutils, which doesn't
understand the `SHT_RELR` relocation sections Arch's system libraries are built
with. It fails on every bundled library and exits non-zero. The deb and rpm are
already written by that point; only the AppImage is affected.

The `tauri` npm script therefore sets `NO_STRIP=1`, which tells linuxdeploy to
skip stripping — so `npm run tauri build` works as-is. Invoking the Tauri CLI
directly (`npx tauri build`) bypasses the script and will still fail; either
export `NO_STRIP=1` yourself or pass `--bundles deb,rpm` to skip the AppImage.
CI is unaffected: it builds on `ubuntu-24.04`, where linuxdeploy's `strip`
handles the system libraries.

## Layout

```
src/            React frontend
  services/     SQLite access; all elapsed-time arithmetic lives in SQL
  store/        Zustand store — the only writer of project state
  utils/        Domain types, billing rules, shared constants
src-tauri/      Rust shell and database migrations
aur/            PKGBUILD for the AUR binary package
```

## Releasing

Bump `version` in `package.json` — everything else reads from it — and push to
the `release` branch. The workflow builds and publishes the installers, then
rewrites `aur/PKGBUILD` with the new version and checksums and uploads the
resulting package.

## License

MIT
