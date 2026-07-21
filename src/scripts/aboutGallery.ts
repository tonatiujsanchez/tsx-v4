/**
 * About page "Signal Photo Desk" gallery.
 *
 * Desktop (pointer: fine): each card is absolutely positioned and can be dragged
 * inside the panel. Movement is clamped to the panel bounds. Click/tap raises
 * the card to the front. A reset button restores initial positions.
 *
 * Mobile / touch (pointer: coarse): no free positioning. Cards render as a
 * horizontal scroll strip with CSS scroll-snap. No JS drag is attached.
 *
 * The initializer is idempotent and cleans up on `astro:before-swap` to be
 * compatible with the ClientRouter / View Transitions in the shared layout.
 */

type CardState = {
    element: HTMLElement;
    initialX: number;
    initialY: number;
    initialRotate: number;
    x: number;
    y: number;
    zIndex: number;
};

type PointerState = {
    card: CardState;
    startPointerX: number;
    startPointerY: number;
    startCardX: number;
    startCardY: number;
    pointerId: number;
    moved: boolean;
};

let cleanup: (() => void) | null = null;

const DESKTOP_QUERY = '(min-width: 900px) and (pointer: fine)';

function measureCard(el: HTMLElement): { width: number; height: number } {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function applyTransform(card: CardState, rotate: number, scale = 1): void {
    card.element.style.transform =
        `translate3d(${card.x}px, ${card.y}px, 0) rotate(${rotate}deg) scale(${scale})`;
}

function initDesktopGallery(panel: HTMLElement): (() => void) | null {
    const stage = panel.querySelector<HTMLElement>('[data-gallery-stage]');
    const cards = Array.from(panel.querySelectorAll<HTMLElement>('[data-gallery-card]'));
    const resetButton = panel.querySelector<HTMLButtonElement>('[data-gallery-reset]');
    if (!stage || cards.length === 0) return null;

    let nextZ = cards.length + 1;
    const cardStates: CardState[] = cards.map((element, index) => {
        const initialX = Number(element.dataset.initialX ?? '0');
        const initialY = Number(element.dataset.initialY ?? '0');
        const initialRotate = Number(element.dataset.initialRotate ?? '0');
        element.style.left = `${initialX}px`;
        element.style.top = `${initialY}px`;
        element.style.zIndex = String(index + 1);
        applyTransform(
            {
                element,
                initialX,
                initialY,
                initialRotate,
                x: 0,
                y: 0,
                zIndex: index + 1,
            },
            initialRotate,
        );
        return {
            element,
            initialX,
            initialY,
            initialRotate,
            x: 0,
            y: 0,
            zIndex: index + 1,
        };
    });

    let stageRect = stage.getBoundingClientRect();
    let cardSizes = cardStates.map((state) => measureCard(state.element));
    let pointer: PointerState | null = null;

    const updateSizes = (): void => {
        stageRect = stage.getBoundingClientRect();
        cardSizes = cardStates.map((state) => measureCard(state.element));
    };

    const bringToFront = (card: CardState): void => {
        nextZ += 1;
        card.zIndex = nextZ;
        card.element.style.zIndex = String(nextZ);
    };

    const raiseCard = (card: CardState): void => {
        cardStates.forEach((c) => c.element.classList.toggle('is-active', c === card));
        bringToFront(card);
    };

    const onPointerDown = (event: PointerEvent, card: CardState, cardIndex: number): void => {
        if (event.button !== undefined && event.button !== 0) return;
        updateSizes();
        raiseCard(card);
        pointer = {
            card,
            startPointerX: event.clientX,
            startPointerY: event.clientY,
            startCardX: card.x,
            startCardY: card.y,
            pointerId: event.pointerId,
            moved: false,
        };
        card.element.setPointerCapture(event.pointerId);
        card.element.classList.add('is-dragging');
        applyTransform(card, card.initialRotate, 1.03);
        // avoid selecting text / scrolling while dragging
        event.preventDefault();
        void cardIndex;
    };

    const onPointerMove = (event: PointerEvent): void => {
        if (!pointer || event.pointerId !== pointer.pointerId) return;
        const card = pointer.card;
        const size = cardSizes[cardStates.indexOf(card)];
        const dx = event.clientX - pointer.startPointerX;
        const dy = event.clientY - pointer.startPointerY;
        if (!pointer.moved && Math.hypot(dx, dy) > 3) pointer.moved = true;

        // Bounds relative to stage (card left/top already applied as initialX/Y).
        // We clamp translate so the card stays fully inside the stage.
        const minX = -card.initialX;
        const maxX = stageRect.width - size.width - card.initialX;
        const minY = -card.initialY;
        const maxY = stageRect.height - size.height - card.initialY;

        card.x = clamp(pointer.startCardX + dx, minX, maxX);
        card.y = clamp(pointer.startCardY + dy, minY, maxY);
        applyTransform(card, card.initialRotate, 1.03);
    };

    const finishPointer = (event: PointerEvent): void => {
        if (!pointer || event.pointerId !== pointer.pointerId) return;
        const card = pointer.card;
        card.element.classList.remove('is-dragging');
        applyTransform(card, card.initialRotate, 1);
        try {
            card.element.releasePointerCapture(pointer.pointerId);
        } catch {
            /* ignore */
        }
        pointer = null;
    };

    const listeners: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];
    const addListener = (el: HTMLElement, type: string, fn: EventListener): void => {
        el.addEventListener(type, fn);
        listeners.push({ el, type, fn });
    };

    cardStates.forEach((card, index) => {
        const el = card.element;
        addListener(el, 'pointerdown', ((ev: Event) => onPointerDown(ev as PointerEvent, card, index)) as EventListener);
        addListener(el, 'pointermove', ((ev: Event) => onPointerMove(ev as PointerEvent)) as EventListener);
        addListener(el, 'pointerup', ((ev: Event) => finishPointer(ev as PointerEvent)) as EventListener);
        addListener(el, 'pointercancel', ((ev: Event) => finishPointer(ev as PointerEvent)) as EventListener);
        el.style.touchAction = 'none';
    });

    const onResize = (): void => {
        updateSizes();
    };
    window.addEventListener('resize', onResize);

    const resetHandler = (): void => {
        cardStates.forEach((card, index) => {
            card.x = 0;
            card.y = 0;
            card.zIndex = index + 1;
            card.element.style.zIndex = String(index + 1);
            card.element.classList.remove('is-active');
            applyTransform(card, card.initialRotate, 1);
        });
        nextZ = cardStates.length + 1;
    };
    resetButton?.addEventListener('click', resetHandler);

    return () => {
        listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
        window.removeEventListener('resize', onResize);
        resetButton?.removeEventListener('click', resetHandler);
        pointer = null;
    };
}

export function initAboutGallery(): void {
    // Idempotent: cleanup any previous run
    cleanup?.();
    cleanup = null;

    const panel = document.querySelector<HTMLElement>('[data-gallery]');
    if (!panel) return;

    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    let disposer: (() => void) | null = null;

    const attach = (): void => {
        disposer?.();
        disposer = null;
        panel.dataset.mode = desktopMedia.matches ? 'desktop' : 'strip';
        if (desktopMedia.matches) {
            disposer = initDesktopGallery(panel);
        }
    };

    attach();

    const onMediaChange = (): void => attach();

    desktopMedia.addEventListener('change', onMediaChange);
    cleanup = () => {
        disposer?.();
        disposer = null;
        desktopMedia.removeEventListener('change', onMediaChange);
    };
}

export function teardownAboutGallery(): void {
    cleanup?.();
    cleanup = null;
}
