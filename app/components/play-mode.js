import Component from '@ember/component';
import { observer } from '@ember/object';
import Meteor from '../utils/meteor';
import { A } from '@ember/array';

export default Component.extend({
    classNames: [ 'play-zone' ],
    meteors: null,
    meteorSpawnInterval: null,
    meteorCleanInterval: null,
    scoreTickerInterval: null,
    countdownInterval: null,
    score: 0,
    // 10% chance
    meteorSpawnChance: 1.0,
    tickRate: 10,
    lives: 0,
    countdown: 0,
    gameObserver: observer('lives', function() {
        if (this.get('lives') < 1) {
            this.trigger('game-over');
        }
    }),
    countdownObserver: observer('countdown', function() {
        if (this.get('countdown') === 0) {
            clearInterval(this.get('countdownInterval'));
            this.setUpGame();
            // auto focus the textarea
            $('.type-area').focus();
        }
    }),
    init() {
        this._super(...arguments);
        this.createCountdown();
        this.on('game-over', this.tearDownGame);
    },
    didRender() {
        this._super(...arguments);
    },
    tearDownGame() {
        clearInterval(this.get('meteorSpawnInterval'));
        clearInterval(this.get('scoreTickerInterval'));
    },
    createCountdown() {
        // countdown timer
        let countdownTime = setInterval(function(comp) {
            comp.decrementProperty('countdown')
        }, 1000, this);

        this.setProperties({
            countdownInterval: countdownTime,
            countdown: 3
        });
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
        }, 1000, this);

        // clean up the meteors object
        let cleanMeteors = setInterval(function(comp) {
            if (comp.get('lives') < 1) {
                clearInterval(comp.get('meteorCleanInterval'));
                comp.set('meteors', A());
            }
            else {
                let newMeteors = comp.get('meteors').filter(function(obj) {
                    return !(obj.isDestroying || obj.isDestroyed);
                });

                comp.set('meteors', newMeteors);
            }
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
            meteors: A(),
            lives: 3
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
        },
        playAgain() {
            this.setUpGame();
        }
    }
});
