import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import Evented from '@ember/object/evented';
import getChar from './alphabet';

export default EmberObject.extend(Evented, {
    pos: null,
    velocity: 0,
    created: null,
    lastUpdate: null,
    updater: null,
    maxSpeed: 13,
    minSpeed: 5,
    text: null,
    multiplier: 1,
    lifetime: 75,
    init() {
        this._super(...arguments);
        let min = this.get('minSpeed'),
            max = this.get('maxSpeed');

        this.set('velocity', Math.floor(Math.random() * (max - min) + min));
        this.set('pos', { x: Math.floor(Math.random() * 101), y: 0 });
        this.set('created', (new Date).getTime());
        let updater = setInterval(function(obj) {
            obj.set('lastUpdate', (new Date).getTime());
        }, 10, this);
        this.set('updater', updater);
        let str = '';
        for (let i = 0; i < Math.random() * (7 - 3) + 3; i++) {
            str += getChar();
        }
        this.set('text', str);
        let velocity = this.get('velocity');
        let deltaSpeed = this.get('maxSpeed') - this.get('minSpeed');
        if (velocity < (deltaSpeed / 2)) {
            this.set('multiplier', 1);
        }
        else if (velocity < (deltaSpeed / 3) * 2) {
            this.set('multiplier', 1.5);
        }
        else {
            this.set('multiplier', 2.0);
        }
    },
    getScore() {
        let curScore = this.get('lifetime') - Math.floor(this.get('curPos'));
        // note the times 2 is to get rid of the case where you have 0.5 scores
        return curScore * this.get('multiplier') * 2;
    },
    destroy() {
        this._super(...arguments);
        clearInterval(this.get('updater'));
    },
    image: computed('velocity', function() {
        let velocity = this.get('velocity');
        let deltaSpeed = this.get('maxSpeed') - this.get('minSpeed');
        if (velocity < (deltaSpeed / 2)) {
            return 'slow';
        }
        else if (velocity < (deltaSpeed / 3) * 2) {
            return 'medium';
        }
        else {
            return 'fast';
        }
    }),
    curPos: computed('pos', 'lastUpdate', function() {
        let created = this.get('created'),
            lastUpdate = this.get('lastUpdate'),
            velocity = this.get('velocity'),
            initialY = this.get('pos.y');

        let diffTime = (lastUpdate - created) / 1000;
        let deltaY = velocity * diffTime;
        let curY = initialY + deltaY;

        if (curY > this.get('lifetime')) {
            this.destroy();
            this.trigger('expired');
        }

        return deltaY;
    })
})
