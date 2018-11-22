import Controller from '@ember/controller';
import Evented from '@ember/object/evented';

export default Controller.extend(Evented, {
    state: 'main-menu',
    isMenu: true,
    init() {
        this._super(...arguments);

        this.on('stateChange', this.stateChange);
    },
    stateChange(state) {
        this.setProperties({
            state: state,
            isMenu: state === 'main-menu'
        });
    },
    actions: {
        play(state) {
            this.stateChange(state);
        },
        menu() {
            this.stateChange('main-menu');
        }
    }
});
