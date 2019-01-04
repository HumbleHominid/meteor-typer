import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
    classNames: [ 'meteor' ],
    attributeBindings: [ 'imgStyle:style' ],
    meteorText: null, // double nested array consisting of [ [ char, style ] ]
    init() {
        this._super(...arguments);
        this.updateText();
    },
    image: computed('data.image', function() {
        return this.get('data.image');
    }),
    meteorX: computed('data.pos.x', function() {
        return this.get('data.pos.x');
    }),
    meteorY: computed('data.curPos', function() {
        return this.get('data.curPos');
    }),
    imgStyle: computed('meteorX', 'meteorY', function() {
        let str = `left:${this.get('meteorX')}%;top:${this.get('meteorY')}%;`;
        return htmlSafe(str);
    }),
    typedTextObserver: observer('typedText', function() {
        this.updateText();
    }),
    updateText() {
        let meteor_text = this.get('data.text'),
            typed_text = this.get('typedText'),
            new_meteor_text = [];
        for (let i = 0; i < meteor_text.length; i++) {
            if (i < typed_text.length) {
                if (meteor_text.charAt(i) === typed_text.charAt(i)) {
                    new_meteor_text.push([ meteor_text.charAt(i), 'correct' ]);
                }
                else {
                    new_meteor_text.push([ meteor_text.charAt(i), 'incorrect' ]);
                }
            }
            else {
                new_meteor_text.push([ meteor_text.charAt(i), 'spare' ]);
            }
        }

        this.set('meteor_text', new_meteor_text);
    }
});
