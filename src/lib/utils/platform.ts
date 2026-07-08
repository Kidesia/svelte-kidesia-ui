/**
 * Returns the platform-appropriate modifier key symbol.
 * ⌘ on macOS, Ctrl on Windows/Linux.
 */
export function getModifierKey(): string {
	if (typeof navigator === 'undefined') return 'Ctrl';
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘' : 'Ctrl';
}
