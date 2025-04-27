import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // encontra todos os produtos
    res.json({ products }); // retorna os produtos encontrados
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao buscar produtos",
      error: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // se não estiver no redis, busque no mongodb
    // .lean() vai retornar um objeto simples em javascript em vez de um objeto do mongodb
    // o que é bom para o desempenho
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({
        message: "Nenhum produto em destaque encontrado",
      });
    }

    // armazenar no redis para um futuro acesso rápido

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    res.json(featuredProducts); // retorna os produtos encontrados
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao buscar produtos em destaque",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body; // desestruturação do corpo da requisição

    let cloudinaryResponse = null;

    if (image) {
      // se a imagem estiver no corpo da requisição, faça o upload para o cloudinary
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product); // retorna o produto criado
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao criar produto",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // procura o produto pelo id

    if (!product) {
      return res.status(404).json({
        message: "Produto nao encontrado",
      });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // pega o id da imagem do cloudinary
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`); // deleta a imagem do cloudinary
      } catch (error) {
        res.status(500).json({
          message: "Erro no sevidor - Erro ao deletar imagem do cloudinary",
          error: error.message,
        });
      }
    }

    await Product.findByIdAndDelete(req.params.id); // deleta o produto do mongodb
    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao deletar produto",
      error: error.message,
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    // aqui você pode adicionar a lógica para recomendar produtos com base em algum critério, como categoria ou preço semelhante
    const porducts = await Product.aggregate([
      { $sample: { size: 3 } }, // pega 3 produtos aleatórios
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(porducts); // retorna os produtos recomendados
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao buscar produtos recomendados",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params; // pega a categoria da requisição
  try {
    const products = await Product.find({ category }); // encontra todos os produtos
    res.json({ products }); // retorna os produtos encontrados
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao buscar produtos por categoria",
      error: error.message,
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // procura o produto pelo id
    if (product) {
      product.isFeatured = !product.isFeatured; // alterna o valor de isFeatured
      const updatedProduct = await product.save(); // atualiza o cache do redis // salva o produto no mongodb
      await updateFeaturedProductsCache();
      res.json(updatedProduct); // retorna o produto atualizado
    } else {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro no sevidor - Erro ao alternar produto em destaque",
      error: error.message,
    });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // O método lean() é usado para retornar objetos JavaScript simples em vez de documentos Mongoose completos. Isso pode melhorar significativamente o desempenho
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); // busca os produtos em destaque no mongodb

    await redis.set("featuredProducts", JSON.stringify(featuredProducts)); // armazena os produtos em destaque no redis
  } catch (error) {
    console.log("Erro in update cache function");
  }
}
