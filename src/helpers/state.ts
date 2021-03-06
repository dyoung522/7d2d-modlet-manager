import getModlets from "helpers/get_modlets";
import { useReducer } from "react";
import { GameXML, fileExists } from ".";

const defaultState: IState = {
  advancedMode: false,
  config: null,
  gameFolder: "",
  gameXML: null,
  modletFolder: "",
  modlets: []
};

function initialState(config: any): IState {
  const gameFolder = config.get("gameFolder");
  const modletFolder = config.get("modletFolder");
  const advancedMode = !!+config.get("mode");

  return {
    config,
    gameFolder,
    modletFolder,
    advancedMode,
    gameXML: gameFolder && fileExists(gameFolder) ? new GameXML(gameFolder) : null,
    modlets: []
  };
}

function sortModlets(a: IModletState, b: IModletState) {
  return a.modlet.get("name") > b.modlet.get("name") ? 1 : -1;
}

function reducer(state: IState, action: { type: string; payload?: any }): IState {
  console.info("Received dispatch:", action);

  switch (action.type) {
    case "setAdvancedMode": {
      state.config.set("mode", +action.payload);
      return {
        ...state,
        advancedMode: action.payload
      };
    }

    case "setGameFolder": {
      state.config.set("gameFolder", action.payload);
      return {
        ...state,
        gameFolder: action.payload,
        gameXML: new GameXML(action.payload)
      };
    }

    case "clearGameFolder": {
      return {
        ...state,
        gameFolder: ""
      };
    }

    case "setModletFolder": {
      state.config.set("modletFolder", action.payload);
      return {
        ...state,
        modletFolder: action.payload,
        modlets: getModlets(action.payload)
      };
    }

    case "setModlets": {
      return {
        ...state,
        modlets: action.payload.sort(sortModlets)
      };
    }

    case "clearModlets": {
      return {
        ...state,
        modlets: []
      };
    }

    case "syncModlets": {
      const modletState = state.modlets.filter((obj: IModletState) => obj.modlet === action.payload.modlet)[0];

      if (!modletState) throw new Error("syncModlets dispatch received invalid modlet");

      const modletStates = state.modlets.filter((obj: IModletState) => obj.modlet !== action.payload.modlet);
      const newModletState = { ...modletState, ...action.payload };

      return {
        ...state,
        modlets: [...modletStates, newModletState].sort(sortModlets)
      };
    }

    case "setGameXML": {
      return {
        ...state,
        gameXML: new GameXML(state.gameFolder)
      };
    }

    default:
      return state;
  }
}

export default (config: any) => useReducer(reducer, defaultState, () => initialState(config));
