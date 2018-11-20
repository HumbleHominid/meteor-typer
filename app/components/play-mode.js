import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { A } from '@ember/array';

const possible = 'abcdefghijklmnopqrstuvwxyz';

const Meteor = EmberObject.extend({
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
            str += possible.charAt(Math.floor(Math.random() * possible.length));
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
        return curScore * this.get('multiplier')
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
        }

        return deltaY;
    })
})

export default Component.extend({
    classNames: [ 'play-zone' ],
    meteors: null,
    meteorSpawnInterval: null,
    meteorCleanInterval: null,
    score: 0,
    // 10% chance
    meteorSpawnChance: 0.10,
    tickRate: 10,
    init() {
        this._super(...arguments);

        let meteorSpawner = setInterval(function(comp) {
            // 10% chance to spawn a meteor every second
            if (comp.get('meteors.length') === 0 ||
                    Math.random() < comp.get('meteorSpawnChance')) {
                comp.createMeteor();
            }
        }, 1 * 1000, this);

        let cleanMeteors = setInterval(function(comp) {
            let newMeteors = comp.get('meteors').filter(function(obj) {
                return !(obj.isDestroying || obj.isDestroyed);
            });

            comp.set('meteors', newMeteors);
        }, this.get('tickRate'), this);

        let scoreTicker = setInterval(function(comp) {
            let curScore = comp.get('score'),
                newScore = curScore + comp.get('tickRate');
            comp.set('score', newScore);
        }, 100, this)

        this.set('meteorSpawnInterval', meteorSpawner);
        this.set('meteorCleanInterval', cleanMeteors);
        this.set('meteors', A());
    },
    // be a good boy and clean up your mess
    destroy() {
        clearInterval(this.get('meteorSpawnInterval'));
        clearInterval(this.get('meteorCleanInterval'));
        this._super(...arguments);
    },
    createMeteor() {
        let newMeteor = Meteor.create();
        this.get('meteors').push(newMeteor);
        this.notifyPropertyChange('meteors');
    },
    actions: {
        testMeteors(e) {
            let meteors = this.get('meteors'),
                text = e.target.value;
            meteors.forEach((meteor) => {
                if (meteor.text === text) {
                    meteor.destroy();
                    e.target.value = '';
                    let score = this.get('score');
                    score += meteor.getScore();
                    this.set('score', score);
                }
            })
        }
    }
});
