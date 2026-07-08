import { computePosition, flip, offset, type Placement, shift } from '@floating-ui/dom';
import type { Attachment } from 'svelte/attachments';

export function tooltip(text: string | undefined, placement: Placement = 'top'): Attachment {
	return (node) => {
		if (!text) return () => {};

		const tooltipEl = document.createElement('div');
		tooltipEl.className = 'tooltip-popover';
		tooltipEl.textContent = text;
		document.body.appendChild(tooltipEl);

		let isVisible = false;
		// When the user clicks/activates the element (e.g. to open a dialog), we suppress
		// focus-based tooltip re-show so the tooltip doesn't reappear when the dialog closes
		// and focus returns to the trigger element. The flag is cleared on the next mouseenter.
		let suppressFocusShow = false;

		function updatePosition() {
			computePosition(node, tooltipEl, {
				placement: placement,
				middleware: [offset(6), flip(), shift({ padding: 5 })]
			}).then(({ x, y }) => {
				Object.assign(tooltipEl.style, {
					left: `${x}px`,
					top: `${y}px`,
					position: 'absolute'
				});
			});
		}

		node.addEventListener('mouseenter', onMouseEnter);
		node.addEventListener('focus', onFocus);
		node.addEventListener('mouseleave', hide);
		node.addEventListener('blur', hide);
		node.addEventListener('click', onInteraction);

		// Touch support: toggle on tap, dismiss when tapping elsewhere
		node.addEventListener('touchstart', onTouchStart, { passive: true });
		document.addEventListener('touchstart', onDocumentTouch, { passive: true });

		function show() {
			isVisible = true;
			tooltipEl.style.display = 'block';
			updatePosition();
		}

		function hide() {
			isVisible = false;
			tooltipEl.style.display = 'none';
		}

		function onMouseEnter() {
			// Mouse re-entering the element clears any post-click suppression
			suppressFocusShow = false;
			show();
		}

		function onFocus() {
			if (suppressFocusShow) return;
			show();
		}

		function onInteraction() {
			// Hide the tooltip and suppress focus-based re-show. This prevents the tooltip
			// from popping up again when a dialog closes and focus returns to this element.
			hide();
			suppressFocusShow = true;
		}

		function onTouchStart(e: Event) {
			e.stopPropagation();
			if (isVisible) {
				hide();
			} else {
				show();
				// Auto-dismiss after 3 seconds on touch
				setTimeout(() => {
					if (isVisible) hide();
				}, 3000);
			}
		}

		function onDocumentTouch(e: Event) {
			if (isVisible && !node.contains(e.target as Node)) {
				hide();
			}
		}

		hide();

		return () => {
			node.removeEventListener('mouseenter', onMouseEnter);
			node.removeEventListener('focus', onFocus);
			node.removeEventListener('mouseleave', hide);
			node.removeEventListener('blur', hide);
			node.removeEventListener('click', onInteraction);
			node.removeEventListener('touchstart', onTouchStart);
			document.removeEventListener('touchstart', onDocumentTouch);
			tooltipEl.remove();
		};
	};
}
