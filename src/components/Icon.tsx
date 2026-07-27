/**
 * The six glyphs the UI actually uses, inlined.
 *
 * primeicons shipped these in five font formats — the .svg alone was 342KB, and
 * WebKitGTK only ever loads the woff2. Six paths cost a few hundred bytes and
 * scale with the surrounding text, so `font-size` sizes them.
 */
const glyphs = {
    times: <path d='M18 6 6 18M6 6l12 12'/>,
    plus: <path d='M5 12h14M12 5v14'/>,
    pencil: <path d='M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z'/>,
    calendar: <>
        <rect x='3' y='4' width='18' height='17' rx='2'/>
        <path d='M8 2v4M16 2v4M3 10h18'/>
    </>,
    check: <path d='M20 6 9 17l-5-5'/>,
    trash: <path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6'/>
}

export type IconName = keyof typeof glyphs

/**
 * A single glyph, drawn in the current text colour at the current font size.
 * @param name - which glyph to draw
 * @param className - extra classes, applied after the defaults
 */
function Icon ({name, className}: {
    name: IconName
    className?: string
}) {
    return (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}
            strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'
            className={`h-[1em] w-[1em] shrink-0 ${className ?? ''}`}>
            {glyphs[name]}
        </svg>
    )
}

export default Icon
