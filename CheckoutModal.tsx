
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, CreditCard, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "../hooks/use-toast";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutModal = ({ onClose, onSuccess }: CheckoutModalProps) => {
  const { cart, currentUser, createOrder, applyCoupon, activeAppliedCoupon } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit" | "debit">("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [saveCardInfo, setSaveCardInfo] = useState(false);
  const [discount, setDiscount] = useState<number | null>(null);

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const total = discount ? subtotal - discount : subtotal;

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite um código de cupom",
        variant: "destructive"
      });
      return;
    }
    
    const discountAmount = applyCoupon(couponCode);
    if (discountAmount !== null) {
      setDiscount(discountAmount);
      setCouponCode("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({ 
        title: "Faça login", 
        description: "Você precisa estar logado para finalizar a compra",
        variant: "destructive" 
      });
      return;
    }

    if ((paymentMethod === "credit" || paymentMethod === "debit") && 
        (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast({ 
        title: "Informações incompletas", 
        description: "Preencha todos os dados do cartão",
        variant: "destructive" 
      });
      return;
    }

    try {
      createOrder(paymentMethod);
      toast({ title: "Pedido realizado com sucesso!" });
      onSuccess();
    } catch (error: any) {
      toast({ 
        title: "Erro ao processar pagamento", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numbers.length && i < 16; i += 4) {
      groups.push(numbers.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };
  
  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };
  
  const formatCvv = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 3);
  };

  const generatePixCode = () => {
    // Simulação de geração de código PIX
    return "00020101021226930014br.gov.bcb.pix2571pix-qrcode.example.com/v2/9d36b84f-c70d-4e8a-88bc-a6d616285d0252040000530398654041.235802BR5925Loja Arte em Croche6009Sao Paulo62070503***6304E2CA";
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <CreditCard size={24} />
            Finalizar Compra
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Endereço de Entrega</h3>
            <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
              <p>
                {currentUser?.address || "Endereço não cadastrado. Atualize seu perfil."}
              </p>
              {!currentUser?.address && (
                <Button variant="outline" size="sm" type="button">
                  Adicionar
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Método de Pagamento</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(v) => setPaymentMethod(v as "pix" | "credit" | "debit")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer">PIX</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex-1 cursor-pointer">Cartão de Crédito</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value="debit" id="debit" />
                <Label htmlFor="debit" className="flex-1 cursor-pointer">Cartão de Débito</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "pix" ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Código PIX</h3>
              <div className="bg-gray-50 p-4 rounded text-center">
                <div className="bg-white p-4 inline-block mb-2 border">
                  {/* Aqui seria uma imagem de QR Code */}
                  <div className="h-48 w-48 bg-gray-100 flex items-center justify-center">
                    QR Code PIX
                  </div>
                </div>
                <div className="mb-2">
                  <small className="block text-gray-500 mb-1">Código para copiar e colar:</small>
                  <Input 
                    value={generatePixCode()} 
                    readOnly 
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Após o pagamento, seu pedido será processado automaticamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="card-number">Número do Cartão</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="card-name">Nome no Cartão</Label>
                <Input
                  id="card-name"
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="card-expiry">Validade</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(formatCvv(e.target.value))}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="save-card" 
                  checked={saveCardInfo} 
                  onCheckedChange={(checked) => setSaveCardInfo(checked as boolean)} 
                />
                <Label htmlFor="save-card">Salvar informações do cartão para próximas compras</Label>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded mb-6">
            <h3 className="text-lg font-medium mb-2">Cupom de Desconto</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o código do cupom"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button type="button" onClick={handleCouponApply}>
                Aplicar
              </Button>
            </div>
            {activeAppliedCoupon && (
              <div className="mt-2 flex items-center text-green-600">
                <Check size={16} className="mr-1" />
                <span>
                  Cupom {activeAppliedCoupon.code} aplicado: {activeAppliedCoupon.discount}% de desconto
                </span>
              </div>
            )}
          </div>

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between text-base mb-2">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {discount && discount > 0 && (
              <div className="flex justify-between text-base mb-2 text-green-600">
                <span>Desconto:</span>
                <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center text-lg font-bold mb-6">
              <span>Total:</span>
              <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <Button type="submit" className="w-full">
              {paymentMethod === "pix" ? "Confirmar Pedido" : "Pagar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
