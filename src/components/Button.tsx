import {type ButtonHTMLAttributes} from 'react'
import Icon, {type IconName} from '@/components/Icon'

/**
 * The app's only button. Shape and interaction states live here; callers pass
 * colour and size through `className`, which is appended last so it wins.
 *
 * `type='button'` by default: these all sit inside dialogs, and an implicit
 * submit would reload the webview.
 */
function Button ({label, icon, iconOnly, className, children, ...rest}: {
    label?: string
    icon?: IconName
    /** Square padding instead of the wide default, for a button that is just a glyph. */
    iconOnly?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) {
    // Chosen here rather than left to the caller's `className`: two padding
    // utilities for the same edge would come down to their order in Tailwind's
    // output, not the order they appear in the string.
    const padding = iconOnly === true ? 'p-2' : 'px-4 py-2'

    return (
        <button type='button'
            className={'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border ' +
                `${padding} font-medium text-white transition-colors ` +
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ' +
                `disabled:cursor-default disabled:opacity-60 ${className ?? ''}`}
            {...rest}>
            {icon !== undefined && <Icon name={icon}/>}
            {label ?? children}
        </button>
    )
}

export default Button
