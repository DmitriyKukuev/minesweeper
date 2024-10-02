import {useVfm, useModal} from 'vue-final-modal';
import {Component} from 'vue';
import ErrorPopup from '@/components/popups/ErrorPopup.vue';

const PopupMap = {
    error: ErrorPopup,
}

function usePopup() {
    function show(component: Component|keyof typeof PopupMap, attrs: Object = {}) {
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

    function closeAll() {
        return useVfm().closeAll();
    }

    function error(message?: string, title?: string) {
        return show('error', {message, title});
    }

    return {
        show,
        closeAll,
        error,
    }
}

const popup = usePopup();
export default popup;
