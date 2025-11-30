
const cf = new Payments({
  env: "TEST", // use "PROD" for live
  clientId: process.env.CASHFREE_APP_ID,
  clientSecret: process.env.CASHFREE_SECRET_KEY,
});

export const createOrder = async (req, res) => {

}