import Component from '@ember/component';

export default Component.extend({
    actions: {
        play() {
            this.trigger('stateChange', 'play-mode');
        }
    }
});
