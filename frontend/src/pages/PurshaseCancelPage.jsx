import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, XCircle } from "lucide-react";

const PurshaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <XCircle className="h-20 w-20 text-red-500 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 text-center mb-2">
            Compra cancelada
          </h1>
          <p className="text-gray-300 text-center mb-3">
            Seu pedido foi cancelado.
            <br />
            Nenhuma cobranca foi efetuada.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 text-center">
              Se você tiver algum problema, entre em contato conosco.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to={"/"}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" size={18} />
              Voltar para a loja
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurshaseCancelPage;
