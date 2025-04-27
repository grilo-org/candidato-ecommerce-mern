import Product from "../models/Product.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    // Adiconar quantidade para cada produto
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos do carrinho" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId); // Verifica se o item já está no carrinho

    if (existingItem) {
      existingItem.quantity += 1; // Se já estiver, aumenta a quantidade
    } else {
      user.cartItems.push(productId); // Se não estiver, adiciona o novo item
    }

    await user.save(); // Salva as alterações no usuário
    res.json(user.cartItems); // Retorna os itens do carrinho atualizados
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar ao carrinho" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; // Obtém o usuário autenticado

    if (!productId) {
      user.cartItems = []; // Limpa todos os itens do carrinho
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao remover todos os itens do carrinho" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // Obtém o ID do produto da URL
    const { quantity } = req.body; // Obtém a nova quantidade do corpo da requisição
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId); // Verifica se o item está no carrinho

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId); // Remove o item se a quantidade for 0
        user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity; // Atualiza a quantidade do item
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Item não encontrado no carrinho" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar a quantidade" });
  }
};
