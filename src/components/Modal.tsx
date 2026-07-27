import {useEffect, useRef, type ReactNode, type SyntheticEvent} from 'react'
import Button from '@/components/Button'

/**
 * A modal dialog built on the native `<dialog>` element, which brings focus
 * trapping, Escape-to-close, the top layer and a backdrop with it — all of the
 * behaviour a dialog component would otherwise have to reimplement.
 *
 * The element stays mounted so the ref is available to `showModal`; the body is
 * only rendered while open, so a closed dialog costs nothing but an empty node.
 * Clicking the backdrop deliberately does nothing: losing a half-filled form to
 * a stray click is worse than having to aim for Cancel.
 * @param header - dialog title
 * @param visible - whether the dialog is open
 * @param onHide - called when the user dismisses it, by X or Escape
 * @param footer - buttons rendered along the bottom
 * @param widthRem - dialog width in rem
 * @param children - dialog body
 */
function Modal ({header, visible, onHide, footer, widthRem, children}: {
    header: string
    visible: boolean
    onHide: () => void
    footer?: ReactNode
    widthRem: number
    children?: ReactNode
}) {
    const dialog = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const element = dialog.current
        if (element === null) return
        if (visible) element.showModal()
        else element.close()
    }, [visible])

    // Escape fires `cancel`. Let the parent close us through `visible` instead of
    // letting the browser close the element behind React's back, which would
    // leave the store still believing a dialog owns the keyboard.
    const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault()
        onHide()
    }

    return (
        <dialog ref={dialog} onCancel={onCancel} style={{width: `${widthRem}rem`}}
            className='m-auto max-w-[90vw] rounded-xl border border-white/15 bg-[#1f1f1f] p-0 text-[#f6f6f6] backdrop:bg-black/60'>
            {visible && (
                <div className='flex flex-col text-left'>
                    <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
                        <h2 className='text-lg font-semibold'>{header}</h2>
                        <Button icon='times' iconOnly aria-label='Close' onClick={onHide}
                            className='rounded-full border-transparent bg-transparent hover:bg-white/10'/>
                    </div>
                    <div className='px-4 py-4'>{children}</div>
                    {footer !== undefined && <div className='border-t border-white/10 px-4 py-3'>{footer}</div>}
                </div>
            )}
        </dialog>
    )
}

export default Modal
