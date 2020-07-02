import { Response, Request } from "express";

import * as woo from "../services/woo";

class WooController {
  getWooData = async function (_req: Request, res: Response) {
    const importedData = await woo.getWooData();
    res.send(importedData);
  };

  importWooData = async function (_req: Request, res: Response) {
    try {
      const importedData = await woo.importWooData();
      res.send(importedData);
    } catch (err) {
      console.log("ERROR when calling woo.importWooData()", err);
      throw err;
    }
  };
}

export default new WooController();
