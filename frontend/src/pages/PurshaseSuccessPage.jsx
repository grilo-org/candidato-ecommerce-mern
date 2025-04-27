import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurshaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", {
          sessionId,
        });
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const params = new URLSearchParams(window.location.search);

    const sessionId = params.get("sessionId") || params.get("session_id");

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("Nenhum ID de sessão encontrado na URL.");
    }
  }, [clearCart]);

  if (isProcessing)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-semibold">
            Processando sua compra...
          </p>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Erro ?</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-gray-400 text-sm mb-6">
            Se você acredita que isso é um erro, por favor entre em contato com
            o suporte.
          </p>
          <Link
            to="/"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center px-4">
      {/* { <button
        onClick={() => setIsProcessing(!isProcessing)}
        className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-lg z-50"
      >
      Toggle Loading
      </button>} */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400">
            Compra realizada com sucesso!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Obrigado por comprar conosco! {"Nós estamos"} processando a sua
            compra.
          </p>

          <p className="text-red-500 font-semibold text-center text-sm mb-6">
            Confira seu email para acompanhar o status da compra
          </p>

          <div className="bg-gray-700 rounded-lg p-4 mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Número do pedido</span>
              <span className="text-sm font-semibold text-gray-100">
                #12345
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Data de entrega</span>
              <span className="text-sm font-semibold text-gray-100">
                3-5 dias úteis
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              <HandHeart className="mr-2" size={18} />
              Obrigado por confiar em nós!
            </button>
            <Link
              to="/"
              className="w-full bg-gray-800 hover:bg-gray-600 text-red-600 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue comprando
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurshaseSuccessPage;
