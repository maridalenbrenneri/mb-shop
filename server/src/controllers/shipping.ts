import { Response, Request } from 'express';
import {
  CargonizerService,
  Consignment,
  ShippingType,
} from '../services/cargonizer-service';
import giftSubscriptionService from '../services/gift-subscription-service';
import { Constants } from '../constants';
import { getCoffeeVariationWeight, getCoffeeVariationSizeLabel } from '../bl';

class ShippingController {
  /*
   * POST /api/shipping/ship-business-order
   */
  CreateConsignmentForBusinessOrder = async function (
    req: Request,
    res: Response
  ) {
    const cargonizer = new CargonizerService();

    try {
      const order = req.body;

      let weight = 0;
      let reference = '';

      order.coffeeItems.forEach((item) => {
        const itemWeight = getCoffeeVariationWeight(item.variationId);
        const itemSizeLabel = getCoffeeVariationSizeLabel(item.variationId);
        weight += itemWeight * item.quantity;
        reference = `${reference}${item.quantity}${item.coffee.code}${itemSizeLabel} `;
      });

      const consignment: Consignment = {
        shippingType: ShippingType.standard_business,
        weight: weight,
        reference,
        customer: {
          email: order.customer.email,
          phone: order.customer.phone,
          name: order.customer.name,
          street1: order.customer.address.street1,
          street2: order.customer.address.street2,
          zipCode: order.customer.address.zipCode,
          place: order.customer.address.place,
          country: 'NO',
          contactPerson: order.customer.contactPerson,
        },
      };

      await cargonizer.requestConsignment(consignment);

      return res.send({ success: true });
    } catch (e) {
      return res.status(400).send(`${e.message}`);
    }
  };

  CreateConsignmentForGiftSubscriptions = async function (
    req: Request,
    res: Response,
    _next: any
  ) {
    const cargonizer = new CargonizerService();

    // WE TRY TO BE NICE WITH CARGONIZER
    const sleep = () => {
      return new Promise((resolve) => setTimeout(resolve, 750));
    };

    try {
      const subscriptions = req.body;

      for (let i = 0; i < subscriptions.length; i++) {
        const sub = subscriptions[i];

        const consignment: Consignment = {
          shippingType: ShippingType.standard_private,
          weight: sub.quantity * Constants.smallBagFreightWeight,
          reference: '#' + sub.wooOrderNumber + ' GABO' + sub.quantity,
          customer: {
            email: sub.recipient_email,
            phone: sub.recipient_phone,
            name: sub.recipient_name,
            street1: sub.recipient_address.street1,
            street2: sub.recipient_address.street2,
            zipCode: sub.recipient_address.zipCode,
            place: sub.recipient_address.place,
            country: 'NO',
            contactPerson: sub.recipient_name,
          },
        };

        //  console.debug('Requesting consignment');

        await cargonizer.requestConsignment(consignment);

        await giftSubscriptionService.setLastOrderCreated(sub.id);

        await sleep();
      }

      return res.send(true);
    } catch (e) {
      return res.status(400).send(`${e.message}`);
    }
  };
}

export default new ShippingController();
