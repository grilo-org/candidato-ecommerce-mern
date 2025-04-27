import React, { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  {
    href: "/placas-de-video",
    name: "Placa de video",
    imageUrl:
      "https://i.ibb.co/5WNcTScg/nvidia-geforce-rtx-3070-vs-amd-radeon-rx-6700-xt.webp",
  },
  {
    href: "/processadores",
    name: "Processadores",
    imageUrl: "https://i.ibb.co/1Y1nKk45/processador.jpg",
  },
  {
    href: "/perifericos",
    name: "Perifericos",
    imageUrl: "https://i.ibb.co/LdFSH8Wy/perifericos3.jpg",
  },
  {
    href: "/monitores",
    name: "Monitores",
    imageUrl: "https://i.ibb.co/3YM31tDg/monitor.jpg",
  },
  {
    href: "/cadeiras",
    name: "Cadeiras",
    imageUrl: "https://i.ibb.co/Fkd1sKdq/cadeiras.jpg",
  },
  {
    href: "/notebooks",
    name: "Notebooks",
    imageUrl: "https://i.ibb.co/HphM1zdk/notebook.png",
  },
  {
    href: "/softwares",
    name: "Softwares",
    imageUrl:
      "https://tenyears.com.br/wp-content/uploads/2023/07/curso_informatica.png",
  },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden pl-20 pr-20">
      <div className="relative z-10 max-h-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-red-600 mb-4">
          Bem-vindo ao Z-Store
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Descubra uma ampla variedade de produtos para melhorar a sua
          experiência de computação.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  );
};

export default HomePage;
