
import { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { X, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "../hooks/use-toast";

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

const ProductDetailsModal = ({ product, onClose, onAddToCart }: ProductDetailsModalProps) => {
  const { currentUser, isFavorite, toggleFavorite, addProductReview } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const handleToggleFavorite = () => {
    if (!currentUser) {
      toast({ 
        title: "Faça login", 
        description: "Você precisa estar logado para favoritar produtos",
        variant: "destructive" 
      });
      return;
    }
    
    toggleFavorite(product.id);
    
    if (isFavorite(product.id)) {
      toast({ title: "Produto removido dos favoritos" });
    } else {
      toast({ title: "Produto adicionado aos favoritos!" });
    }
  };
  
  const handleSubmitReview = () => {
    if (!currentUser) {
      toast({ 
        title: "Faça login", 
        description: "Você precisa estar logado para enviar uma avaliação",
        variant: "destructive" 
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({ 
        title: "Comentário vazio", 
        description: "Por favor, escreva um comentário para sua avaliação",
        variant: "destructive" 
      });
      return;
    }
    
    addProductReview(product.id, rating, comment);
    setComment("");
    toast({ title: "Avaliação enviada com sucesso!" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-primary">{product.name}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/2 bg-secondary h-[300px] flex items-center justify-center rounded-lg">
              {product.image}
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </div>
                <Button 
                  variant="outline"
                  className={isFavorite(product.id) ? 'text-red-500 hover:text-red-600' : ''}
                  onClick={handleToggleFavorite}
                >
                  <Heart size={18} className="mr-2" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                  Favoritar
                </Button>
              </div>
              
              {product.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={18}
                      className="text-yellow-400"
                      fill={product.rating && star <= Math.round(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews?.length || 0} avaliações)
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Descrição:</h3>
                <p className="text-gray-600">
                  {product.description || "Este produto é feito à mão com muito carinho e dedicação. Material de alta qualidade para garantir durabilidade e beleza para sua casa."}
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button onClick={onAddToCart} className="w-full">
                  <ShoppingCart size={18} className="mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Avaliações</h3>
            
            {currentUser && (
              <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Deixe sua avaliação</h4>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-yellow-400 focus:outline-none"
                    >
                      <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="Escreva seu comentário aqui..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={handleSubmitReview}>Enviar Avaliação</Button>
              </div>
            )}
            
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={16}
                              className="text-yellow-400"
                              fill={star <= review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Este produto ainda não possui avaliações.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
