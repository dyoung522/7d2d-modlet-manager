import fs from "fs";
import path from "path";

export default class GameXML {
  private _gameFolder: string;
  private _configFolder: string;
  private _gameXML: XMLDocument;

  constructor(gameFolder: string) {
    this._gameFolder = gameFolder;
    this._configFolder = path.normalize(path.join(this._gameFolder, "Data", "Config"));
    this._gameXML = this.readGameXML(this.folderTree(this._configFolder));
  }

  private folderTree(directory: string) {
    let files: string[] = [];

    fs.readdirSync(directory).forEach((file: string) => {
      const newPath = path.join(directory, file);

      if (fs.statSync(newPath).isDirectory()) {
        files = files.concat(this.folderTree(newPath));
      } else {
        if (path.extname(file) === ".xml") files.push(newPath);
      }
    });

    return files;
  }

  private xmlNode(file: string) {
    const parser = new DOMParser();
    const document = parser.parseFromString(fs.readFileSync(file, "utf8"), "text/xml");

    return document.getElementsByTagName(document.documentElement.nodeName)[0];
  }

  private readGameXML(gameFiles: string[]): XMLDocument {
    let xml: XMLDocument = document.implementation.createDocument(null, "config", null);

    gameFiles.forEach(file => {
      xml.documentElement.append(this.xmlNode(file));
    });

    return xml;
  }

  private evaluateXPath(command: string, xpath: string, newValue: string | null): string | undefined {
    let nodes = [];

    const result = this._gameXML.evaluate(xpath, this._gameXML, null, XPathResult.ANY_TYPE, null);
    let xmlItem = result.iterateNext();

    while (xmlItem) {
      nodes.push(xmlItem);
      xmlItem = result.iterateNext();
    }

    if (!nodes.length) return `Could not apply ${xpath}`;
    if (command === "set" && newValue !== null) nodes.forEach(node => (node.nodeValue = newValue));
    if (command === "remove") {
      nodes.forEach(node => {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
    }
  }

  public reset() {
    this._gameXML = this.readGameXML(this.folderTree(this._configFolder));
  }

  public validate(modlet: Modlet): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      let errorArray: string[] = [];
      // let commandArray = ["set", "append", "remove"];
      let commandArray = ["set", "remove"];

      this.folderTree(path.join(modlet.modInfo.folderPath, "Config")).forEach((file: string) => {
        const node = this.xmlNode(file);

        if (node) {
          Array.from(node.childNodes).forEach(childNode => {
            const tag = childNode.nodeName;
            let newValue = null;

            if (commandArray.includes(tag)) {
              let fileXPath;

              if (tag === "set") newValue = childNode.textContent;

              if (childNode.childNodes[0] && childNode.childNodes[0].parentElement)
                fileXPath = childNode.childNodes[0].parentElement.getAttribute("xpath");

              if (fileXPath) {
                // xpath must begin with '//' to match items in gameXML
                const xpath = fileXPath.replace(/^\/*(\w+)/, "//$1");

                let result = this.evaluateXPath(tag, xpath, newValue);
                if (result) errorArray.push(result);
              }
            }
          });
        } else {
          reject(new Error(`Could not read XML Node from ${file}`));
        }
      });

      resolve(errorArray);
    });
  }
}
