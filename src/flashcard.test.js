import { update, MSGS, app } from './index.js';

test('Input change question updates model correctly', () => {
  const initModel = {
    inputQuestion: '',
    inputAnswer: '',
    cards: [],
    currentIndex: 0,
    categories: [
      { name: 'Poor', cards: [] },
      { name: 'Good', cards: [] },
      { name: 'Excellent', cards: [] },
    ],
  };

  const updatedModel = update({ type: MSGS.INPUT_CHANGE_QUESTION, data: 'New Question' }, initModel);

  expect(updatedModel.inputQuestion).toBe('New Question');
});

test('Input change answer updates model correctly', () => {
  const initModel = {
    inputQuestion: '',
    inputAnswer: '',
    cards: [],
    currentIndex: 0,
    categories: [
      { name: 'Poor', cards: [] },
      { name: 'Good', cards: [] },
      { name: 'Excellent', cards: [] },
    ],
  };

  const updatedModel = update({ type: MSGS.INPUT_CHANGE_ANSWER, data: 'New Answer' }, initModel);

  expect(updatedModel.inputAnswer).toBe('New Answer');
});

