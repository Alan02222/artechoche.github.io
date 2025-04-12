
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ClientLoginModalProps {
  onClose: () => void;
  onRegisterClick: () => void;
  onForgotPassword: () => void;
}

const ClientLoginModal = ({ onClose, onRegisterClick, onForgotPassword }: ClientLoginModalProps) => {
  const { loginUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser(email, password)) {
      onClose();
      toast({ title: "Login realizado com sucesso!" });
    } else {
      toast({ 
        title: "Erro de autenticação", 
        description: "Email ou senha incorretos",
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

      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Acessar Minha Conta
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="client-password" className="block mb-2 font-medium">
              Senha
            </label>
            <Input
              type="password"
              id="client-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="mb-6 text-right">
            <button 
              type="button" 
              onClick={onForgotPassword}
              className="text-primary hover:underline text-sm"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button type="submit" className="w-full mb-4">
            Entrar
          </Button>
          
          <p className="text-center">
            Não tem uma conta?{" "}
            <button 
              type="button" 
              onClick={onRegisterClick}
              className="text-primary hover:underline"
            >
              Registre-se
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClientLoginModal;
