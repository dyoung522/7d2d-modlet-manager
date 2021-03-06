/* eslint-disable */
// @ts-ignore
abstract class Modlet {
  abstract modInfo: { [index in "file" | "folderName" | "folderPath"]: string };
  abstract enable(enabled: boolean): void;
  abstract errors(): string[];
  abstract get(key: string): string;
  abstract isEnabled(): boolean;
  abstract isValid(): boolean;
}

abstract class GameXML {
  abstract reset(hard?: boolean): void;
  abstract validate(modlet: Modlet): Promise<string[]>;
}

interface IModletState {
  modlet: Modlet;
  validated: boolean;
  errors: string[];
}

interface IStore {
  gameFolder: string;
  modletFolder: string;
  mode: number;
}

interface IState {
  advancedMode: boolean;
  config: any;
  gameFolder: string;
  gameXML: GameXML | null;
  modletFolder: string;
  modlets: IModletState[];
}
