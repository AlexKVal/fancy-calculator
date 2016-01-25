import Ember from 'ember';
import ProblemGenerator from '../models/problem-generator';

const {
  computed,
  isPresent
} = Ember;

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

export default Ember.Controller.extend({
  levels: [1, 2, 3, 4],
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],

  isRetrying: computed.gt('tryCount', 0),

  problem: computed('problems', 'problemIndex', function() {
    const { problems, problemIndex } = this.getProperties('problems', 'problemIndex');
    if (isPresent(problems) && isPresent(problemIndex)) {
      return problems.objectAt(problemIndex);
    }
  }),

  isComplete: computed('problems', 'problemIndex', function() {
    const { problems, problemIndex } = this.getProperties('problems', 'problemIndex');
    if (isPresent(problems) && isPresent(problemIndex)) {
      return problemIndex >= problems.length;
    }
  }),

  isAnswerComplete: computed('answer', 'problem.answer', function() {
    const { answer, problemAnswer } = this.getProperties('answer', 'problem.answer');

    if (isPresent(answer) && isPresent(problemAnswer)) {
      return answer.toString().length === problemAnswer.toString().length;
    }

    return false;
  }),

  isAnswerCorrect: computed('answer', 'problem.answer', function() {
    const { answer, problemAnswer } = this.getProperties('answer', 'problem.answer');

    if (isPresent(answer) && isPresent(problemAnswer)) {
      return answer === problemAnswer;
    }

    return false;
  }),

  wholeNumberDivisionTuples: computed(function() {
    const tuples = [];
    const max = 100;

    for (let numerator = 1; numerator <= max; numerator++) {
      for (let denominator = 1; denominator <= max; denominator++) {
        const answer = numerator / denominator;
        if (answer % denominator === 0) {
          tuples.pushObject([numerator, denominator]);
        }
      }
    }

    return tuples;
  }),

  inSettingsMode: computed('isOn', 'mode', function() {
    return this.get('isOn') && this.get('mode') === 'settings';
  }),

  inGameMode: computed('isOn', 'mode', function() {
    return this.get('isOn') && this.get('mode') === 'game';
  }),

  actions: {
    turnOn() {
      if (this.get('isOn')) {
        return;
      }

      this.set('isOn', true);
      this.set('level', this.get('levels').objectAt(0));
      this.set('operator', '+');
      this.set('mode', 'settings');
    },

    turnOff() {
      this.set('isOn', false);
    },

    changeOperator(operator) {
      if (this.get('inSettingsMode')) {
        this.set('operator', operator);
      }
    },

    go() {
      if (this.get('inSettingsMode')) {
        this.set('mode', 'game');
        this.send('newGame');
      } else {

        if (this.get('isDisplayingAnswer')) {
          this.toggleProperty('isDisplayingAnswer');
          this.send('nextProblem');
        } else if (this.get('isComplete')) {
          this.send('newGame');
        }

      }
    },

    newGame() {
      this.set('problemIndex', null);
      this.set('correctAnswerCount', 0);
      this.set('isDisplayingAnswer', false);

      const problems = [];
      const uniqueRandomIndexes = [];
      const tuples = this.get('wholeNumberDivisionTuples');

      while (uniqueRandomIndexes.length < 4) {
        const index = randomInteger(tuples.length);
        if (!uniqueRandomIndexes.contains(index)) {
          uniqueRandomIndexes.pushObject(index);
        }
      }

      while (problems.length < 4) {
        let termOne;
        let termTwo;

        const operator = this.get('operator');
        switch (operator) {
          case '/':
            [termOne, termTwo] = tuples[uniqueRandomIndexes[problems.length]];
            break;
        }

        const problemGenerator = ProblemGenerator.create({
          operator,
          level: this.get('level')
        });

        problems.pushObject(problemGenerator.generate());
      }

      this.set('problems', problems);
      this.send('nextProblem');
    },

    nextProblem() {
      this.set('answer', null);
      this.set('isAnswerLocked', false);
      this.set('isIncorrect', false);
      this.set('tryCount', 0);

      if (isPresent(this.get('problemIndex'))) {
        this.incrementProperty('problemIndex');
      } else {
        this.set('problemIndex', 0);
      }
    },

    changeSettings() {
      if (this.get('inGameMode')) {
        this.setProperties({
          mode: 'settings',
          problems: null,
          problemIndex: null,
          answer: null
        });
      }
    },

    nextLevel() {
      if (this.get('inSettingsMode')) {
        const level = this.get('level');
        const levelIndex = this.get('levels').indexOf(level);
        const nextLevel = this.get('levels').objectAt(
          (levelIndex + 1) % this.get('levels').length
        );
        this.set('level', nextLevel);
      }
    },

    pressDigit(digit) {
      if (this.get('inGameMode') && !this.get('isAnswerLocked')) {
        const newAnswer = this.get('answer') ? parseInt(`${this.get('answer')}${digit}`) : digit;
        this.set('answer', newAnswer);

        if (this.get('isAnswerComplete')) {
          this.set('isAnswerLocked', true);
          this.incrementProperty('tryCount');

          if (this.get('isAnswerCorrect')) {
            if (this.get('tryCount') === 1) {
              this.incrementProperty('correctAnswerCount');
            }
            this.set('tryCount', 0);

            // pause before next question
            Ember.run.later(this, function() {
              this.send('nextProblem');
            }, 500);
          } else { // isAnswerComplete false
            // show EEE for 0.5 sec
            Ember.run.later(this, function() {
              this.set('isIncorrect', true);
              // then continue with the next task after 1s pause
              Ember.run.later(this, function() {
                this.set('isIncorrect', false);

                if (this.get('tryCount') === 3) {
                  this.set('answer', this.get('problem.answer'));
                  this.toggleProperty('isDisplayingAnswer');
                  this.set('isAnswerLocked', true);
                } else {
                  this.set('isAnswerLocked', false);
                  this.set('answer', null);
                }
              }, 1000);
            }, 500);
          }

        }
      }
    }
  }
});
