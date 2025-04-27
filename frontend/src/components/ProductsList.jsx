import React from "react";
import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      className="bg-gray-900 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Produto
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Preço
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Categoria
            </th>
            {/* <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Estoque
            </th> */}
            <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Destaque
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-800 text-left text-xs leading-4 font-medium text-gray-400 uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.countInstock}</div>
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200 cursor-pointer`}
                >
                  <Star className="w-5 h-5 " />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-500 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
