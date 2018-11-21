import Component from '@ember/component';
import { computed } from '@ember/object';
import Meteor from '../utils/meteor';
import { A } from '@ember/array';

export default Component.extend({
    classNames: [ 'play-zone' ],
    meteors: null,
    meteorSpawnInterval: null,
    meteorCleanInterval: null,
    scoreTickerInterval: null,
    score: 0,
    // 10% chance
    meteorSpawnChance: 0.10,
    tickRate: 10,
    lives: 3,
    init() {
        this._super(...arguments);

        this.setUpGame();
    },
    didRender() {
        this._super(...arguments);
        // focus the textarea
        $('.type-area').focus();
    },
    tearDownGame() {
        clearInterval(this.get('meteorSpawnInterval'));
        clearInterval(this.get('meteorCleanInterval'));
        clearInterval(this.get('scoreTickerInterval'));
        this.set('meteors', A());
    },
    setUpGame() {
        // set up the spawner for the meteors
        // TODO: make this dynamic
        let meteorSpawner = setInterval(function(comp) {
            // 10% chance to spawn a meteor every second
            if (comp.get('meteors.length') === 0 ||
                    Math.random() < comp.get('meteorSpawnChance')) {
                comp.createMeteor();
            }
        }, 1 * 1000, this);

        // clean up the meteors object
        let cleanMeteors = setInterval(function(comp) {
            let newMeteors = comp.get('meteors').filter(function(obj) {
                return !(obj.isDestroying || obj.isDestroyed);
            });

            comp.set('meteors', newMeteors);
        }, this.get('tickRate'), this);

        // set up the passive score
        let scoreTicker = setInterval(function(comp) {
            let curScore = comp.get('score'),
                newScore = curScore + comp.get('tickRate');
            comp.set('score', newScore);
        }, 100, this);

        this.setProperties({
            meteorSpawnInterval: meteorSpawner,
            meteorCleanInterval: cleanMeteors,
            scoreTickerInterval: scoreTicker,
            meteors: A()
        });
    },
    // be a good boy and clean up your mess
    destroy() {
        clearInterval(this.get('meteorSpawnInterval'));
        clearInterval(this.get('meteorCleanInterval'));
        clearInterval(this.get('scoreTickerInterval'));
        this._super(...arguments);
    },
    createMeteor() {
        let newMeteor = Meteor.create();
        newMeteor.on('expired', () => {
            this.decrementProperty('lives');
        });
        this.get('meteors').push(newMeteor);
        this.notifyPropertyChange('meteors');
    },
    actions: {
        testMeteors(e) {
            let meteors = this.get('meteors'),
                text = e.target.value.toLowerCase();
            if (text.indexOf('\n') !== -1) {
                e.target.value = '';
            }
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
