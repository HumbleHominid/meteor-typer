import Component from '@ember/component';

export default Component.extend({
    classNames: [ 'menu-list' ],
    actions: {
        mouseEnter(sender, e) {
            console.log(e)
        },
        mouseLeave() {

        }
    }
});
