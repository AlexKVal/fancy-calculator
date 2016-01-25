import Ember from 'ember';
import Problem from './problem';

const {
  computed
} = Ember;

const { max, floor, ceil, random } = Math;

function randomBetween(minimum, maximum) {
  return floor(random() * (maximum + 1 - minimum) + minimum);
}

export default Ember.Object.extend({
  operator: null,
  level: null,

  minTermOne: computed('operator', 'level', function() {
    const level = this.get('level');
    switch (this.get('operator')) {
      case '+':
        switch (level) {
          case 3:
            return 11;
          case 4:
            return 11;
        }

      case '-':
        return this.get('minAnswer') + this.get('minTermTwo');

      case '*':
        switch (level) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 4;
        }

      default:
        return 0;
    }
  }),

  maxTermOne: computed('operator', 'level', function() {
    const level = this.get('level');
    switch (this.get('operator')) {
      case '+':
        switch (level) {
          case 1:
            return 5;
          case 2:
            return 10;
          case 3:
            return 25;
          case 4:
            return 51;
        }

      case '-':
        switch (level) {
          case 1:
            return 9;
          case 2:
            return 20;
          case 3:
            return 50;
          case 4:
            return 99;
        }

      case '*':
        switch (level) {
          case 1:
            return 5;
          case 2:
            return 9;
          case 3:
            return 12;
          case 4:
            return 19;
        }

      case '/':
        return this.get('minTermTwo') * this.get('maxAnswer');
    }
  }),

  minTermTwo: computed('operator', 'level', function() {
    const level = this.get('level');
    switch (this.get('operator')) {
      case '*':
        return this.get('minTermOne');

      case '-':
        switch (level) {
          case 3:
            return 11;
          case 4:
            return 11;
          default:
            return 0;
        }

      case '/':
        switch (level) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 10;
        }

      default:
        return 0;
    }
  }),

  maxTermTwo: computed('operator', 'level', function() {
    switch (this.get('operator')) {
      case '/':
        return ceil(this.get('maxTermOne') / this.get('minAnswer'));
      default:
        return 99;
    }
  }),

  minAnswer: computed('operator', 'level', function() {
    const level = this.get('level');
    switch (this.get('operator')) {
      case '+':
        switch (level) {
          case 1:
            return 0;
          case 2:
            return 10;
          case 3:
            return 20;
          case 4:
            return 60;
        }

      case '-':
        switch (level) {
          case 3:
            return 10;
          case 4:
            return 25;
          default:
            return 0;
        }

      case '*':
        return 1;

      case '/':
        switch (level) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 3:
            return 3;
          case 4:
            return 4;
        }

      default:
        return 0;
    }
  }),

  maxAnswer: computed('operator', 'level', function() {
    const level = this.get('level');
    switch (this.get('operator')) {
      case '+':
        switch (level) {
          case 1:
            return 9;
          case 2:
            return 20;
          case 3:
            return 50;
          case 4:
            return 99;
        }

      case '-':
        switch (level) {
          case 1:
            return 9;
          case 2:
            return 9;
          case 3:
            return 20;
          case 4:
            return 80;
        }

      case '*':
        switch (level) {
          case 1:
            return 10;
          case 2:
            return 20;
          case 3:
            return 50;
          case 4:
            return 99;
        }

      case '/':
        switch (level) {
          case 1:
            return 3;
          case 2:
            return 9;
          case 3:
            return 20;
          case 4:
            return 10;
        }
    }
  }),

  generate() {
    const {
      operator,
      minTermOne, maxTermOne,
      minTermTwo, maxTermTwo,
      minAnswer, maxAnswer
    } = this.getProperties(
      'operator',
      'minTermOne', 'maxTermOne',
      'minTermTwo', 'maxTermTwo',
      'minAnswer', 'maxAnswer'
    );

    let termTwoCeiling;
    let termTwoFloor;
    let termTwo;
    let termOne = randomBetween(minTermOne, maxTermOne);

    switch (operator) {
      case '+':
        termTwoCeiling = maxAnswer - termOne;
        termTwoFloor = max(minAnswer - termOne, 0);
        termTwo = randomBetween(termTwoFloor, termTwoCeiling);
        break;
      case '-':
        termTwoCeiling = max(termOne - maxAnswer, minTermTwo);
        termTwoFloor = max(termOne - maxAnswer, minTermTwo);
        termTwo = randomBetween(termTwoFloor, termTwoCeiling);
        break;
      case '*':
        termTwoCeiling = floor(maxAnswer / termOne);
        termTwoFloor = max(ceil(minAnswer / termOne), minTermTwo);
        termTwo = randomBetween(termTwoFloor, termTwoCeiling);
        break;
      case '/':
        termTwo = randomBetween(minTermTwo, maxTermTwo);

        const termOnes = [];
        for (let m = minAnswer; m * termTwo <= maxTermOne; m++) {
          termOnes.pushObject(m * termTwo);
        }
        termOne = termOnes[randomBetween(0, termOnes.length - 1)];
    }

    return Problem.create({ operator, termOne, termTwo });
  }
});
