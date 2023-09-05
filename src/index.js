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
};

function view(dispatch, model) {
  const card = model.cards[model.currentIndex];

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
        { className: `${btnStyle} bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.ADD_CARD }) },
        "Add Card"
      ),
    ]),

    div({ className: "flex flex-col mt-4" },
      model.cards.length > 0 ? [
        div({ className: "rounded-lg shadow-lg p-4 bg-white w-96" }, [
          h1({ className: "text-xl font-semibold mb-2" }, "Card:"),
          card.editing ? // Prüfen, ob die Karte bearbeitet wird
            div({ className: "mb-4" }, [
              input({
                className: "border p-2",
                oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_QUESTION, data: event.target.value }),
                value: model.inputQuestion,
                placeholder: "Edit question...",
              }),
              input({
                className: "border p-2",
                oninput: (event) => dispatch({ type: MSGS.INPUT_CHANGE_ANSWER, data: event.target.value }),
                value: model.inputAnswer,
                placeholder: "Edit answer...",
              }),
              button(
                { className: `${btnStyle} bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.SAVE_EDIT }) },
                "Save Edit"
              ),
            ]) :
            div({ className: "mb-4" }, card.question),
          button(
            { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.DELETE_CARD }) },
            "Delete Card"
          ),
          button(
            { className: `${btnStyle} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.TOGGLE_ANSWER }) },
            card.showAnswer ? "Hide Answer" : "Show Answer"
          ),
          card.showAnswer ? div({ className: "mb-4" }, card.answer) : null,
          button(
            { className: `${btnStyle} bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.EDIT_CARD }) },
            "Edit Card"
          ),
        ]),
        div({ className: "flex gap-2 mt-4" }, [
          button(
            { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.PREVIOUS_CARD }) },
            "Previous"
          ),
          button(
            { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.NEXT_CARD }) },
            "Next"
          ),
        ]),
      ] : [
        p({}, "No cards available."),
      ]
    ),
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
        return {
          ...model,
          inputQuestion: "",
          inputAnswer: "",
          cards: [
            ...model.cards,
            { question: model.inputQuestion, answer: model.inputAnswer, showAnswer: false, editing: false }, // Antwort standardmäßig ausblenden, nicht bearbeiten
          ],
        };
      } else {
        return model;
      }

    case MSGS.DELETE_CARD:
      if (model.cards.length > 0) {
        const updatedCards = [...model.cards];
        updatedCards.splice(model.currentIndex, 1);
        return { ...model, cards: updatedCards, currentIndex: 0 };
      } else {
        return model;
      }

    case MSGS.NEXT_CARD:
      if (model.cards.length > 0) {
        const nextIndex = (model.currentIndex + 1) % model.cards.length;
        return { ...model, currentIndex: nextIndex };
      } else {
        return model;
      }

    case MSGS.PREVIOUS_CARD:
      if (model.cards.length > 0) {
        const previousIndex = (model.currentIndex - 1 + model.cards.length) % model.cards.length;
        return { ...model, currentIndex: previousIndex };
      } else {
        return model;
      }

    case MSGS.TOGGLE_ANSWER:
      const updatedCardsWithToggle = [...model.cards];
      updatedCardsWithToggle[model.currentIndex].showAnswer = !updatedCardsWithToggle[model.currentIndex].showAnswer;
      return { ...model, cards: updatedCardsWithToggle };

    case MSGS.EDIT_CARD:
      const updatedCardsWithEdit = [...model.cards];
      updatedCardsWithEdit[model.currentIndex].editing = true; // Karte bearbeiten
      return { ...model, inputQuestion: updatedCardsWithEdit[model.currentIndex].question, inputAnswer: updatedCardsWithEdit[model.currentIndex].answer, cards: updatedCardsWithEdit };

    case MSGS.SAVE_EDIT:
      if (model.inputQuestion !== "" && model.inputAnswer !== "") {
        const updatedCardsForEdit = [...model.cards];
        updatedCardsForEdit[model.currentIndex].question = model.inputQuestion;
        updatedCardsForEdit[model.currentIndex].answer = model.inputAnswer;
        updatedCardsForEdit[model.currentIndex].editing = false; // Bearbeiten beenden
        return { ...model, inputQuestion: "", inputAnswer: "", cards: updatedCardsForEdit };
      } else {
        return model;
      }

    default:
      return model;
  }
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
};

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
