import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product, Message, SiteSettings, AdminCredentials, User, CartItem, Order, OrderProduct, Review, Coupon } from '../types';
import { toast } from '../hooks/use-toast';

interface StoreContextType {
  products: Product[];
  messages: Message[];
  siteSettings: SiteSettings;
  isAdmin: boolean;
  currentUser: User | null;
  cart: CartItem[];
  orders: Order[];
  coupons: Coupon[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  addMessage: (message: Omit<Message, 'id' | 'date'>) => void;
  deleteMessage: (id: number) => void;
  updateSettings: (settings: SiteSettings) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id'>) => void;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  createOrder: (paymentMethod: Order['paymentMethod']) => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addProductReview: (productId: number, rating: number, comment: string) => void;
  createCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  applyCoupon: (code: string) => number | null;
  activeAppliedCoupon: Coupon | null;
  setActiveAppliedCoupon: (coupon: Coupon | null) => void;
  verifyUser: (userId: number) => void;
  requestPasswordReset: (email: string) => boolean;
}

const defaultSettings: SiteSettings = {
  siteTitle: 'Arte em Crochê',
  bannerTitle: 'Peças Artesanais em Crochê',
  bannerText: 'Trabalhos feitos à mão com amor e dedicação para deixar sua casa mais aconchegante e estilosa.',
  aboutText: 'Olá! Sou Maria, apaixonada por crochê há mais de 10 anos. Cada peça que crio é única e feita com muito carinho, utilizando materiais de alta qualidade para garantir durabilidade e beleza.',
  deliveryInfo: 'Entregamos para todo o Brasil. O prazo de entrega varia de acordo com a sua localização.',
  returnPolicy: 'Você tem até 7 dias após o recebimento para solicitar a troca ou devolução do produto.'
};

const adminCredentials: AdminCredentials = {
  username: 'admin',
  password: 'admin123'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeAppliedCoupon, setActiveAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem('crocheProducts');
    const storedMessages = localStorage.getItem('crocheMessages');
    const storedSettings = localStorage.getItem('crocheSettings');
    const storedUsers = localStorage.getItem('crocheUsers');
    const storedCurrentUser = localStorage.getItem('crocheCurrentUser');
    const storedCart = localStorage.getItem('crocheCart');
    const storedOrders = localStorage.getItem('crocheOrders');
    const storedCoupons = localStorage.getItem('crocheCoupons');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const defaultProducts = [
        { id: 1, name: 'Tapete Redondo', price: 89.90, image: 'tapete.jpg' },
        { id: 2, name: 'Almofada Decorativa', price: 69.90, image: 'almofada.jpg' },
        { id: 3, name: 'Conjunto de Porta-Copos', price: 45.00, image: 'porta-copos.jpg' }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('crocheProducts', JSON.stringify(defaultProducts));
    }

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    if (storedSettings) {
      setSiteSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem('crocheSettings', JSON.stringify(defaultSettings));
    }

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers = [
        { id: 1, name: 'Cliente Teste', email: 'teste@exemplo.com', password: 'senha123', address: 'Rua Exemplo, 123' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('crocheUsers', JSON.stringify(defaultUsers));
    }

    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    } else {
      const defaultCoupons = [
        { code: 'BEMVINDO10', discount: 10, expiryDate: '2025-12-31', used: false },
        { code: 'PROMO20', discount: 20, expiryDate: '2025-06-30', minPurchase: 200, used: false }
      ];
      setCoupons(defaultCoupons);
      localStorage.setItem('crocheCoupons', JSON.stringify(defaultCoupons));
    }
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('crocheProducts', JSON.stringify(updatedProducts));
    toast({ title: "Produto adicionado com sucesso!" });
  };

  const updateProduct = (id: number, product: Omit<Product, 'id'>) => {
    const updatedProducts = products.map(p => p.id === id ? { ...product, id } : p);
    setProducts(updatedProducts);
    localStorage.setItem('crocheProducts', JSON.stringify(updatedProducts));
    toast({ title: "Produto atualizado com sucesso!" });
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('crocheProducts', JSON.stringify(updatedProducts));
    toast({ title: "Produto excluído com sucesso!" });
  };

  const addMessage = (message: Omit<Message, 'id' | 'date'>) => {
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    const newMessage = { ...message, id: newId, date: new Date().toISOString() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('crocheMessages', JSON.stringify(updatedMessages));
    toast({ title: "Mensagem enviada com sucesso!" });
  };

  const deleteMessage = (id: number) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('crocheMessages', JSON.stringify(updatedMessages));
    toast({ title: "Mensagem excluída com sucesso!" });
  };

  const updateSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem('crocheSettings', JSON.stringify(settings));
    toast({ title: "Configurações salvas com sucesso!" });
  };

  const login = (username: string, password: string) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const registerUser = (userData: Omit<User, 'id'>) => {
    if (users.some(user => user.email === userData.email)) {
      throw new Error("Este email já está cadastrado");
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { 
      ...userData, 
      id: newId,
      favorites: [],
      verified: false
    };
    const updatedUsers = [...users, newUser];
    
    setUsers(updatedUsers);
    localStorage.setItem('crocheUsers', JSON.stringify(updatedUsers));
    
    setTimeout(() => {
      verifyUser(newId);
      toast({ 
        title: "Email verificado automaticamente", 
        description: "Em um ambiente de produção, enviariamos um email de verificação",
        variant: "default"
      });
    }, 2000);
  };

  const loginUser = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('crocheCurrentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('crocheCurrentUser');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, ...userData } : user
    );
    
    const updatedUser = { ...currentUser, ...userData };
    
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    
    localStorage.setItem('crocheUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('crocheCurrentUser', JSON.stringify(updatedUser));
    
    toast({ title: "Perfil atualizado com sucesso!" });
  };

  const toggleFavorite = (productId: number) => {
    if (!currentUser) return;
    
    const favorites = currentUser.favorites || [];
    const isFav = favorites.includes(productId);
    
    const updatedFavorites = isFav 
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    updateUserProfile({ favorites: updatedFavorites });
  };
  
  const isFavorite = (productId: number) => {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.includes(productId);
  };

  const addProductReview = (productId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const reviews = product.reviews || [];
    
    const existingReviewIndex = reviews.findIndex(r => r.userId === currentUser.id);
    
    if (existingReviewIndex >= 0) {
      const updatedReviews = [...reviews];
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        rating,
        comment,
        date: new Date().toISOString()
      };
      
      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      const newRating = totalRating / updatedReviews.length;
      
      updateProduct(productId, {
        ...product,
        reviews: updatedReviews,
        rating: newRating
      });
    } else {
      const newReview: Review = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment,
        date: new Date().toISOString()
      };
      
      const updatedReviews = [...reviews, newReview];
      
      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      const newRating = totalRating / updatedReviews.length;
      
      updateProduct(productId, {
        ...product,
        reviews: updatedReviews,
        rating: newRating
      });
    }
  };

  const verifyUser = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, verified: true } : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('crocheUsers', JSON.stringify(updatedUsers));
    
    if (currentUser && currentUser.id === userId) {
      const updatedCurrentUser = { ...currentUser, verified: true };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('crocheCurrentUser', JSON.stringify(updatedCurrentUser));
    }
  };

  const requestPasswordReset = (email: string) => {
    const user = users.find(u => u.email === email);
    if (!user) return false;
    
    toast({ 
      title: "Email de recuperação enviado", 
      description: "Verifique sua caixa de entrada para recuperar sua senha",
      variant: "default"
    });
    
    return true;
  };

  const addToCart = (product: Product) => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    localStorage.setItem('crocheCart', JSON.stringify(cart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('crocheCart', JSON.stringify(updatedCart));
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('crocheCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('crocheCart', JSON.stringify([]));
  };

  const createOrder = (paymentMethod: Order['paymentMethod']) => {
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }
    
    if (cart.length === 0) {
      throw new Error("Carrinho vazio");
    }
    
    const orderProducts: OrderProduct[] = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));
    
    let total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    let discount = 0;
    
    if (activeAppliedCoupon) {
      discount = (total * activeAppliedCoupon.discount) / 100;
      total -= discount;
      
      const updatedCoupons = coupons.map(c => 
        c.code === activeAppliedCoupon.code ? { ...c, used: true } : c
      );
      setCoupons(updatedCoupons);
      localStorage.setItem('crocheCoupons', JSON.stringify(updatedCoupons));
    }
    
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const newOrder: Order = {
      id: newId,
      userId: currentUser.id,
      products: orderProducts,
      total,
      status: paymentMethod === 'pix' ? 'pending' : 'paid',
      paymentMethod,
      date: new Date().toISOString(),
      couponApplied: activeAppliedCoupon?.code,
      discount: discount > 0 ? discount : undefined
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('crocheOrders', JSON.stringify(updatedOrders));
    
    clearCart();
    setActiveAppliedCoupon(null);
    
    toast({ 
      title: "Pedido confirmado", 
      description: `Pedido #${newId} realizado com sucesso!`,
      variant: "default" 
    });
  };

  const createCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const updatedCoupons = [...coupons, coupon];
    setCoupons(updatedCoupons);
    localStorage.setItem('crocheCoupons', JSON.stringify(updatedCoupons));
    toast({ title: "Cupom criado com sucesso!" });
  };
  
  const applyCoupon = (code: string): number | null => {
    setActiveAppliedCoupon(null);
    
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      toast({ 
        title: "Cupom inválido", 
        description: "Esse código de cupom não existe",
        variant: "destructive" 
      });
      return null;
    }
    
    if (new Date() > new Date(coupon.expiryDate)) {
      toast({ 
        title: "Cupom expirado", 
        description: "Esse cupom não é mais válido",
        variant: "destructive" 
      });
      return null;
    }
    
    if (coupon.used) {
      toast({ 
        title: "Cupom já utilizado", 
        description: "Esse cupom já foi utilizado anteriormente",
        variant: "destructive" 
      });
      return null;
    }
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      toast({ 
        title: "Valor mínimo não atingido", 
        description: `Esse cupom requer uma compra mínima de R$ ${coupon.minPurchase.toFixed(2).replace('.', ',')}`,
        variant: "destructive" 
      });
      return null;
    }
    
    const discount = (cartTotal * coupon.discount) / 100;
    setActiveAppliedCoupon(coupon);
    
    toast({ title: `Cupom aplicado: ${coupon.discount}% de desconto!` });
    return discount;
  };

  return (
    <StoreContext.Provider value={{
      products,
      messages,
      siteSettings,
      isAdmin,
      currentUser,
      cart,
      orders,
      coupons,
      addProduct,
      updateProduct,
      deleteProduct,
      addMessage,
      deleteMessage,
      updateSettings,
      login,
      logout,
      registerUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      createOrder,
      toggleFavorite,
      isFavorite,
      addProductReview,
      createCoupon,
      applyCoupon,
      activeAppliedCoupon,
      setActiveAppliedCoupon,
      verifyUser,
      requestPasswordReset
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
