import axios from "axios";
require("dotenv").config();

class PaymobServices {
  private apiKey: string = process.env.PAYMOB_API_KEY || "";

  async authRequest() {
    const url = "https://accept.paymob.com/api/auth/tokens";
    const response: any = await axios.post(url, {
      api_key: this.apiKey,
    });
    return response.data.token;
  }

  async registerOrder(orderData: object) {
    const url = "https://accept.paymob.com/api/ecommerce/orders";
    const response = await axios.post(url, orderData);

    return response.data.id;
  }
  async getPaymentKeyRequest(data: object) {
    const url = "https://accept.paymob.com/api/acceptance/payment_keys";
    const response = await axios.post(url, data);
    return response.data.token;
  }
}

export const paymobServices = new PaymobServices();
