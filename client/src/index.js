import "./styles.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

const bribeJudges = async () => {
  console.log("works");
  const response = await fetch("http://127.0.0.1:5000/bribes", {
    method: "POST"
  });
};

const presentationMachine = createMachine({
  id: "presentation",
  initial: "beginning",
  context: {
    headerContent: "Stately Hackathon Hacker",
    button1Content: "Begin",
    bribeCount: 0
  },
  states: {
    beginning: {
      on: {
        NEXT: "mostImportant"
      }
    },
    mostImportant: {
      entry: assign({
        headerContent: "What's most important in a hackathon?",
        button1Content: "Next"
      }),
      on: {
        NEXT: "simplicity"
      }
    },
    simplicity: {
      entry: assign({
        headerContent: "Simplicity.",
        button1Content: "Next"
      }),
      on: {
        NEXT: "mostSimple"
      }
    },
    mostSimple: {
      entry: assign({
        headerContent: "What's most simple?",
        button1Content: "Next"
      }),
      on: {
        NEXT: "bribery"
      }
    },
    bribery: {
      entry: assign({
        headerContent: "Bribery.",
        button1Content: "Next"
      }),
      on: {
        NEXT: "bribe"
      }
    },
    bribe: {
      entry: assign({
        headerContent: "Bribery.",
        button1Content: "End Presentation",
        button2Content: "Bribe Judges"
      }),
      exit: assign({ bribeCount: (ctx) => ctx.bribeCount + 1 }),
      on: {
        NEXT: "end",
        BRIBE: "bribeAction"
      }
    },
    bribeAction: {
      entry: () => {
        bribeJudges();
      },
      on: {
        '': [
          { target: 'bribe', cond: () => true }
        ]
      }
    },
    end: {
      entry: assign({
        headerContent: "End.",
        button1Content: null,
        button2Content: null
      })
    }
  },
  actions: {
    bribe: (context, event) => {
      context.bribeCount++;
      console.log("activating...");
    }
  }
});

function App() {
  const [state, send] = useMachine(presentationMachine);
  const {
    headerContent,
    button1Content,
    button2Content,
    bribeCount
  } = state.context;

  return (
    <div className="App">
      <h1>{headerContent}</h1>
      {button2Content != null ? (
        <button onClick={() => send("BRIBE")}>{button2Content}</button>
      ) : (
        <p></p>
      )}
      {button1Content != null ? (
        <button onClick={() => send("NEXT")}>{button1Content}</button>
      ) : (
        <p></p>
      )}
      {bribeCount > 0 ? <p>Bribe count: {bribeCount}</p> : <p></p>}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);