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
};

function view(dispatch, model) {
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
        p({}, `Card ${model.currentIndex + 1}:`),
        p({}, `Question: ${model.cards[model.currentIndex].question}`),
        p({}, `Answer: ${model.cards[model.currentIndex].answer}`),
        div({ className: "flex gap-2" }, [
          button(
            { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.PREVIOUS_CARD }) },
            "Previous"
          ),
          button(
            { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.NEXT_CARD }) },
            "Next"
          ),
        ]),
        button(
          { className: `${btnStyle} bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded`, onclick: () => dispatch({ type: MSGS.DELETE_CARD }) },
          "Delete Card"
        ),
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
            { question: model.inputQuestion, answer: model.inputAnswer },
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
