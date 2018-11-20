import Component from '@ember/component';

export default Component.extend({
    classNames: [ 'menu-item' ],
    classNameBindings: [ 'hovered:selected' ],
    hovered: false,
    mouseEnter() {
        this.set('hovered', true);
    },
    mouseLeave() {
        this.set('hovered', false);
    },
    click() {
        this.get('clickAction') ();
    }
});
