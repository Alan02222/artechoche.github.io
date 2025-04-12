
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useState } from "react";
import { ShoppingCart, User, Package, Heart, LogOut } from "lucide-react";
import LoginModal from "./LoginModal";
import ClientLoginModal from "./ClientLoginModal";
import ClientRegisterModal from "./ClientRegisterModal";
import CartModal from "./CartModal";
import CheckoutModal from "./CheckoutModal";
import OrdersModal from "./OrdersModal";
import ProfileModal from "./ProfileModal";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Header = () => {
  const { siteSettings, isAdmin, logout, currentUser, logoutUser, cart } = useStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isClientLoginModalOpen, setIsClientLoginModalOpen] = useState(false);
  const [isClientRegisterModalOpen, setIsClientRegisterModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favorites = currentUser?.favorites?.length || 0;

  const handleOpenCheckout = () => {
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutModalOpen(false);
  };
  
  const handleForgotPassword = () => {
    setIsClientLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-20">
      <div className="container">
        <nav className="flex flex-wrap justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            {siteSettings.siteTitle}
          </Link>
          
          <ul className="flex items-center space-x-1 md:space-x-5 mt-3 md:mt-0 order-1 md:order-none w-full md:w-auto">
            <li>
              <Link to="/" className="font-medium hover:text-primary transition-colors px-2 py-1">
                Início
              </Link>
            </li>
            <li>
              <a href="#produtos" className="font-medium hover:text-primary transition-colors px-2 py-1">
                Produtos
              </a>
            </li>
            <li>
              <a href="#sobre" className="font-medium hover:text-primary transition-colors px-2 py-1">
                Sobre
              </a>
            </li>
            <li>
              <a href="#contato" className="font-medium hover:text-primary transition-colors px-2 py-1">
                Contato
              </a>
            </li>
          </ul>
          
          <div className="flex items-center space-x-2">
            {/* Favoritos */}
            {currentUser && (
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
                onClick={() => setIsProfileModalOpen(true)}
                title="Meus Favoritos"
              >
                <Heart size={20} />
                {favorites > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {favorites}
                  </span>
                )}
              </Button>
            )}
            
            {/* Carrinho de compras */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setIsCartModalOpen(true)}
              title="Carrinho de Compras"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            
            {/* Cliente logado/não logado */}
            {currentUser ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center gap-1" onClick={() => setIsProfileModalOpen(true)}>
                  <User size={20} className="mr-1" />
                  <span className="hidden md:inline">{currentUser.name.split(' ')[0]}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 hidden group-hover:block">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    onClick={() => {
                      setIsProfileModalOpen(true);
                    }}
                  >
                    <User size={16} className="mr-2" />
                    Meu Perfil
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center"
                    onClick={() => setIsOrdersModalOpen(true)}
                  >
                    <Package size={16} className="mr-2" />
                    Meus Pedidos
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 flex items-center"
                    onClick={logoutUser}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setIsClientLoginModalOpen(true)}
              >
                Entrar
              </Button>
            )}
            
            {/* Admin */}
            {isAdmin ? (
              <Link 
                to="/admin" 
                className="font-medium hover:text-primary transition-colors"
              >
                Painel Admin
              </Link>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="font-medium hover:text-primary transition-colors ml-2"
              >
                Admin
              </button>
            )}
            {isAdmin && (
              <button
                onClick={logout}
                className="font-medium hover:text-primary transition-colors"
              >
                Sair
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
      
      {isClientLoginModalOpen && (
        <ClientLoginModal 
          onClose={() => setIsClientLoginModalOpen(false)} 
          onRegisterClick={() => {
            setIsClientLoginModalOpen(false);
            setIsClientRegisterModalOpen(true);
          }}
          onForgotPassword={handleForgotPassword}
        />
      )}
      
      {isClientRegisterModalOpen && (
        <ClientRegisterModal 
          onClose={() => setIsClientRegisterModalOpen(false)}
          onLoginClick={() => {
            setIsClientRegisterModalOpen(false);
            setIsClientLoginModalOpen(true);
          }}
        />
      )}
      
      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal 
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onBackToLogin={() => {
            setIsForgotPasswordModalOpen(false);
            setIsClientLoginModalOpen(true);
          }}
        />
      )}
      
      {isCartModalOpen && (
        <CartModal 
          onClose={() => setIsCartModalOpen(false)}
          onCheckout={handleOpenCheckout}
        />
      )}
      
      {isCheckoutModalOpen && (
        <CheckoutModal 
          onClose={() => setIsCheckoutModalOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
      
      {isOrdersModalOpen && (
        <OrdersModal onClose={() => setIsOrdersModalOpen(false)} />
      )}
      
      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;
