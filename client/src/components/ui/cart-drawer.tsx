import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Button } from "./button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const [_, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative hover:scale-110 transition-transform"
        >
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center animate-in zoom-in">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="text-2xl">Votre Panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 py-4 border-b"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={`/images/${item.product.image}`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.product.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length > 0 ? (
          <div className="pt-6 space-y-4 border-t mt-auto">
            <div className="flex justify-between">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                €{total().toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full transition-transform hover:scale-105"
              onClick={() => setLocation("/checkout")}
            >
              Procéder au Paiement
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Panier Vide
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}