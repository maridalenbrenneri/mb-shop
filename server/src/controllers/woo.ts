import { Response, Request } from "express";

import * as woo from "../services/woo-data";

class WooController {
  getWooData = async function (_req: Request, res: Response) {
    const importedData = await woo.getWooData();
    res.send(importedData);
  };

  importWooData = async function (_req: Request, res: Response) {
    const importedData = await woo.importWooData();
    res.send(importedData);
  };
}

export default new WooController();
