
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, User as UserIcon, Heart, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import OrdersModal from "./OrdersModal";
import { Badge } from "./ui/badge";
import { CardContent, Card } from "./ui/card";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const { currentUser, updateUserProfile, products } = useStore();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [showOrders, setShowOrders] = useState(false);

  const favoriteProducts = products.filter(
    (product) => currentUser?.favorites?.includes(product.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({ 
        title: "Campos obrigatórios", 
        description: "Nome e email são campos obrigatórios",
        variant: "destructive" 
      });
      return;
    }
    
    updateUserProfile({
      name,
      email,
      address,
      phone
    });
    
    toast({ title: "Perfil atualizado com sucesso!" });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <UserIcon size={24} />
              Meu Perfil
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          <Tabs defaultValue="account">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="account" className="flex-1">Minha Conta</TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                Favoritos
                {favoriteProducts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {favoriteProducts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1" onClick={() => setShowOrders(true)}>
                Pedidos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="profile-name" className="block mb-2 font-medium">
                      Nome Completo
                    </label>
                    <Input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profile-email" className="block mb-2 font-medium">
                      Email
                    </label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {currentUser?.verified ? (
                      <span className="text-xs text-green-600 mt-1 inline-block">Email verificado</span>
                    ) : (
                      <span className="text-xs text-amber-600 mt-1 inline-block">Email não verificado</span>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="profile-address" className="block mb-2 font-medium">
                      Endereço de Entrega
                    </label>
                    <Input
                      id="profile-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número, bairro, cidade, estado, CEP"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profile-phone" className="block mb-2 font-medium">
                      Telefone
                    </label>
                    <Input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Salvar Alterações
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="favorites">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Você ainda não tem produtos favoritos</p>
                  <Button variant="outline" onClick={onClose}>
                    Explorar Produtos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteProducts.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4 flex items-center">
                        <div className="h-16 w-16 bg-secondary flex items-center justify-center rounded mr-4">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-primary font-bold">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  Visualize todos os seus pedidos realizados
                </p>
                <Button onClick={() => setShowOrders(true)}>
                  Ver Meus Pedidos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showOrders && (
        <OrdersModal onClose={() => setShowOrders(false)} />
      )}
    </>
  );
};

export default ProfileModal;
