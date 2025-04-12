
import { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import ProductDetailsModal from "./ProductDetailsModal";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, currentUser, toggleFavorite, isFavorite } = useStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({ title: "Produto adicionado ao carrinho!" });
  };

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

  return (
    <>
      <Card className="h-full overflow-hidden transition-transform hover:translate-y-[-5px]">
        <div 
          className="h-[200px] bg-secondary flex items-center justify-center relative cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          {product.image}
          {product.rating && (
            <Badge className="absolute top-2 right-2 bg-primary">
              ⭐ {product.rating.toFixed(1)}
            </Badge>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg cursor-pointer" onClick={() => setShowDetails(true)}>
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-xl font-bold text-primary mb-2">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button 
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            Adicionar ao Carrinho
          </Button>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              Detalhes
            </Button>
            <Button 
              variant="outline"
              className={`w-10 p-0 ${isFavorite(product.id) ? 'text-red-500 hover:text-red-600' : ''}`}
              onClick={handleToggleFavorite}
            >
              <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showDetails && (
        <ProductDetailsModal 
          product={product} 
          onClose={() => setShowDetails(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default ProductCard;
