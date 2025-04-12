
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, ArrowLeft } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface ForgotPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordModal = ({ onClose, onBackToLogin }: ForgotPasswordModalProps) => {
  const { requestPasswordReset } = useStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({ 
        title: "E-mail obrigatório", 
        description: "Por favor, digite seu e-mail",
        variant: "destructive" 
      });
      return;
    }
    
    const success = requestPasswordReset(email);
    if (success) {
      setIsSubmitted(true);
    } else {
      toast({ 
        title: "E-mail não encontrado", 
        description: "Não encontramos uma conta com esse e-mail",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <button
        className="absolute top-5 right-5 text-white text-2xl"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <Card className="w-full max-w-md">
        <CardHeader>
          <button 
            onClick={onBackToLogin} 
            className="flex items-center text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para login
          </button>
          <CardTitle className="text-2xl font-bold text-primary">
            Recuperação de Senha
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                E-mail enviado com sucesso!
              </h3>
              <p className="mb-4">
                Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <p className="text-sm text-gray-500">
                Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mb-4 text-gray-600">
                Digite seu e-mail abaixo e enviaremos um link para redefinição de senha.
              </p>
              <div className="mb-5">
                <label htmlFor="reset-email" className="block mb-2 font-medium">
                  E-mail
                </label>
                <Input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar Link de Recuperação
              </Button>
            </form>
          )}
        </CardContent>
        
        {isSubmitted && (
          <CardFooter>
            <Button variant="outline" onClick={onClose} className="w-full">
              Fechar
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordModal;
