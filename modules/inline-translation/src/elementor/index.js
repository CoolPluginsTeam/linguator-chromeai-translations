import ControlBase from './control-base.js';

const App = () => {
    const prefix = 'ewtElementorInlineTranslation';
    return new ControlBase(prefix);
}

jQuery(window).on('elementor:loaded', function () {
    App();
})