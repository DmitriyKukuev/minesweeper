import {useVfm, useModal} from 'vue-final-modal';
import {Component} from 'vue';
import ErrorPopup from '@/components/popups/ErrorPopup.vue';

const PopupMap: Record<string, Component> = {
    error: ErrorPopup,
}

export function show(component: Component|keyof typeof PopupMap, attrs: Object = {}) {
    const modalComponent = typeof component === 'string'
        ? PopupMap[component]
        : component;

    const modal = useModal({
        component: modalComponent,
        attrs: {
            ...attrs,
            onClose() {
                return modal.close();
            },
        },
    });

    return modal.open();
}

export function closeAll() {
    return useVfm().closeAll();
}

export function error(message?: string, title?: string) {
    return show('error', {message, title});
}
