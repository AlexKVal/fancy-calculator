import { moduleForModel, test } from 'ember-qunit';

moduleForModel('problem-generator', 'Unit | problem generator', {
  unit: true
});

const operators = ['+', '-', '*', '/'];
const levels = [1, 2, 3, 4];

operators.forEach((operator) => {
  levels.forEach((level) => {
    test(`${operator} L ${level}`, function(assert) {
      for(let t = 0; t < 100; t++) {
        const subject = this.subject();

        subject.setProperties({ operator, level });
        const problem = subject.generate();

        const minTermOne = subject.get('minTermOne');
        const minTermTwo = subject.get('minTermTwo');
        const maxAnswer = subject.get('maxAnswer');
        const minAnswer = subject.get('minAnswer');

        const termOne = problem.get('termOne');
        const termTwo = problem.get('termTwo');
        const answer = problem.get('answer');

        const terms = `${termOne},${termTwo}`;

        assert.ok(termOne >= minTermOne, `termOne: ${termOne}, minTermOne: ${minTermOne}. ${terms}`);
        assert.ok(termOne <= maxTermOne, `termOne: ${termOne}, maxTermOne: ${maxTermOne}. ${terms}`);

        assert.ok(termTwo >= minTermTwo, `termTwo: ${termTwo}, minTermTwo: ${minTermTwo}. ${terms}`);
        assert.ok(termTwo <= maxTermTwo, `termTwo: ${termTwo}, maxTermTwo: ${maxTermTwo}. ${terms}`);

        assert.ok(answer <= maxAnswer, `answer: ${answer}, maxAnswer: ${maxAnswer}. ${terms}`);
        assert.ok(answer >= minAnswer, `answer: ${answer}, minAnswer: ${minAnswer}. ${terms}`);
      }
    });
  });
});
