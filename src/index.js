import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const div = (props, children) => h("div", props, children);
const button = (props, children) => h("button", props, children);
const p = (props, children) => h("p", props, children);
const h1 = (props, children) => h("h1", props, children);
const input = (props) => h("input", props);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

const MSGS = {
  INPUT_CHANGE_QUESTION: "INPUT_CHANGE_QUESTION",
  INPUT_CHANGE_ANSWER: "INPUT_CHANGE_ANSWER",
  ADD_CARD: "ADD_CARD",
  DELETE_CARD: "DELETE_CARD",
  NEXT_CARD: "NEXT_CARD",
  PREVIOUS_CARD: "PREVIOUS_CARD",
  TOGGLE_ANSWER: "TOGGLE_ANSWER",
  EDIT_CARD: "EDIT_CARD",
  SAVE_EDIT: "SAVE_EDIT",
  RATE_POOR: "RATE_POOR",
  RATE_GOOD: "RATE_GOOD",
  RATE_EXCELLENT: "RATE_EXCELLENT",
};

function view(dispatch, model) {
  function renderCard(dispatch, card, index) {
    return div({ className: "rounded-lg shadow-lg p-4 bg-white w-96" }, [
      h1({ className: "text-xl font-semibold mb-2" }, "Card:"),
      card.editing ? // Prüfen, ob die Karte bearbeitet wird
        div({ className: "mb-4" }, [
          input({
            className: "border p-2",
            oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_QUESTION, data: event.target.value }),
            value: model.inputQuestion, // Hier verwenden wir model.inputQuestion
            placeholder: "Edit question...",
          }),
          input({
            className: "border p-2",
            oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_ANSWER, data: event.target.value }),
            value: model.inputAnswer, // Hier verwenden wir model.inputAnswer
            placeholder: "Edit answer...",
          }),
          button(
            { className: `${btnStyle} hover.text-yellow-700 text-yellow-500 font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.SAVE_EDIT, data: index }) },
            "Save Edit"
          ),
        ]) :
        div({ className: "mb-4" }, card.question),
      button(
        { className: `${btnStyle} bg-red-500 hover.bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.DELETE_CARD, data: index }) },
        "Delete Card"
      ),
      button(
        { className: `${btnStyle} bg-blue-500 hover.bg-blue-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.TOGGLE_ANSWER, data: index }) },
        card.showAnswer ? "Hide Answer" : "Show Answer"
      ),
      card.showAnswer ? div({ className: "mb-4" }, card.answer) : null,
      button(
        { className: `${btnStyle} bg.yellow-500 hover.bg-yellow-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.EDIT_CARD, data: index }) },
        "Edit Card"
      ),
      div({ className: "flex gap-2 mt-4" }, [
        button(
          { className: `${btnStyle} bg-red-500 hover.bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.RATE_POOR, data: index }) },
          "Rate Poor"
        ),
        button(
          { className: `${btnStyle} bg-green-500 hover.bg-green-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.RATE_GOOD, data: index }) },
          "Rate Good"
        ),
        button(
          { className: `${btnStyle} bg-blue-500 hover.bg-blue-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.RATE_EXCELLENT, data: index }) },
          "Rate Excellent"
        ),
      ]),
    ]);
  }

  return div({ className: "flex gap-4 flex-col items-center" }, [
    h1({ className: "text-2xl" }, `Flashcard App:`),

    div({ className: "flex gap-4 items-center" }, [
      input({
        className: "border p-2",
        oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_QUESTION, data: event.target.value }),
        value: model.inputQuestion,
        placeholder: "Enter question...",
      }),

      input({
        className: "border p-2",
        oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_ANSWER, data: event.target.value }),
        value: model.inputAnswer,
        placeholder: "Enter answer...",
      }),

      button(
        { className: `${btnStyle} bg-green-500 hover.bg-green-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.ADD_CARD }) },
        "Add Card"
      ),
    ]),

    div({ className: "flex flex-col mt-4" }, [
      model.cards.length > 0 ? div({ className: "flex gap-4" }, model.categories.map((category) => {
        return div({ className: "w-96" }, [
          h1({ className: "text-2xl" }, category.name),
          div({ className: "mb-4" }, category.cards.map((cardIndex) => {
            const card = model.cards[cardIndex];
            return renderCard(dispatch, card, cardIndex);
          })),
        ]);
      })) : p({}, "No cards available."),
    ]),
  ]);
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.INPUT_CHANGE_QUESTION:
      return { ...model, inputQuestion: msg.data };

    case MSGS.INPUT_CHANGE_ANSWER:
      return { ...model, inputAnswer: msg.data };

    case MSGS.ADD_CARD:
      if (model.inputQuestion !== "" && model.inputAnswer !== "") {
        const newCard = {
          question: model.inputQuestion,
          answer: model.inputAnswer,
          showAnswer: false,
          editing: false,
        };

        // Hier wird die Karte zur Kategorie "Poor" hinzugefügt
        model.categories[0].cards.push(model.cards.length);
        return {
          ...model,
          inputQuestion: "",
          inputAnswer: "",
          cards: [...model.cards, newCard],
        };
      } else {
        return model;
      }

    case MSGS.DELETE_CARD:
      if (model.cards.length > 0) {
        const updatedCategories = [...model.categories];
        updatedCategories.forEach((category) => {
          const indexInCategory = category.cards.indexOf(msg.data);
          if (indexInCategory !== -1) {
            category.cards.splice(indexInCategory, 1);
          }
        });

        const updatedCards = [...model.cards];
        updatedCards.splice(msg.data, 1);

        return { ...model, categories: updatedCategories, cards: updatedCards };
      } else {
        return model;
      }

    case MSGS.TOGGLE_ANSWER:
      const updatedCardsWithToggle = [...model.cards];
      updatedCardsWithToggle[msg.data].showAnswer = !updatedCardsWithToggle[msg.data].showAnswer;
      return { ...model, cards: updatedCardsWithToggle };

    case MSGS.EDIT_CARD:
      const updatedCardsWithEdit = [...model.cards];
      updatedCardsWithEdit[msg.data].editing = true; // Karte bearbeiten
      return {
        ...model,
        inputQuestion: updatedCardsWithEdit[msg.data].question,
        inputAnswer: updatedCardsWithEdit[msg.data].answer,
        cards: updatedCardsWithEdit,
      };

    case MSGS.SAVE_EDIT:
      if (model.inputQuestion !== "" && model.inputAnswer !== "") {
        const updatedCardsForEdit = [...model.cards];
        updatedCardsForEdit[msg.data].question = model.inputQuestion;
        updatedCardsForEdit[msg.data].answer = model.inputAnswer;
        updatedCardsForEdit[msg.data].editing = false; // Bearbeiten beenden
        return { ...model, inputQuestion: "", inputAnswer: "", cards: updatedCardsForEdit };
      } else {
        return model;
      }

    case MSGS.RATE_POOR:
      return rateCard(model, msg.data, 0);

    case MSGS.RATE_GOOD:
      return rateCard(model, msg.data, 1);

    case MSGS.RATE_EXCELLENT:
      return rateCard(model, msg.data, 2);

    default:
      return model;
  }
}

// Hilfsfunktion zur Bewertung einer Karte
function rateCard(model, cardIndex, rating) {
  if (model.cards.length > 0) {
    const updatedCategories = [...model.categories];
    const currentCategory = getCategoryByCardIndex(model, cardIndex);

    if (currentCategory) {
      const currentIndexInCategory = currentCategory.cards.indexOf(cardIndex);

      if (currentIndexInCategory !== -1) {
        currentCategory.cards.splice(currentIndexInCategory, 1);

        if (rating === 0) {
          updatedCategories[0].cards.push(cardIndex); // Schlechte Antwort
        } else if (rating === 1) {
          updatedCategories[1].cards.push(cardIndex); // Gute Antwort
        } else {
          updatedCategories[2].cards.push(cardIndex); // Perfekte Antwort
        }
      }
    }

    return { ...model, categories: updatedCategories };
  } else {
    return model;
  }
}

// Hilfsfunktion zur Ermittlung der Kategorie einer Karte
function getCategoryByCardIndex(model, cardIndex) {
  for (const category of model.categories) {
    if (category.cards.includes(cardIndex)) {
      return category;
    }
  }
  return null;
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  inputQuestion: "",
  inputAnswer: "",
  cards: [],
  currentIndex: 0,
  categories: [
    { name: "Poor", cards: [] },
    { name: "Good", cards: [] },
    { name: "Excellent", cards: [] },
  ],
};

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
