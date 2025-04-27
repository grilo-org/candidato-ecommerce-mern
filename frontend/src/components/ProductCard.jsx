import React from "react";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Faça login para adicionar ao carrinho", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative h-60 overflow-hidden rounded-t-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black opacity-15 hover:opacity-0" />
      </div>

      <div className="pt-4 px-5 pb-5 bg-black/20">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-2xl font-bold text-emerald-400">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 cursor-pointer"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
