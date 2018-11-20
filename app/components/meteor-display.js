import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
    classNames: [ 'meteor' ],
    attributeBindings: [ 'imgStyle:style' ],
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
    })
});
