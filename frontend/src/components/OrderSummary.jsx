import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); //* Importa a chave pública do Stripe
const stripePromise = loadStripe(
  "pk_test_51RG68D4IDRH70r16jG4fk2rdAZj9D0jWcQnKcEgHGZ8HsOBsAjS0XL04zkW5NYcYsX7SiU4HAQgEA7fbNu7tdR2o00YTnoBuVa"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;

  const formattedSubtotal = subtotal.toFixed(2).replace(".", ",");
  const formattedTotal = total.toFixed(2).replace(".", ",");
  const formattedSavings = savings.toFixed(2).replace(".", ",");

  async function handlePayment() {
    const stripe = await stripePromise;
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });
    const session = res.data;
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.error("Error:", result.error);
    }
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-red-400">Resumo do pedido</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-sm font-normal text-gray-400">Preço total</dt>
            <dd className="text-sm font-medium text-gray-100">
              R$ {formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Desconto</dt>
              <dd className="text-base font-medium text-gray-100">
                -R$ {formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Cupom ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-red-500">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-gray-100">Total</dt>
            <dd className="text-base font-bold text-gray-100">
              R$ {formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-lg font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={handlePayment}
        >
          Finalizar compra
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">ou</span>
          <Link
            to={"/"}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-500 underline hover:text-red-400 hover:no-underline"
          >
            Continue comprando
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
