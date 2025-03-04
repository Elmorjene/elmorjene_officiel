import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
        <div className="aspect-square relative group">
          <img
            src={`/images/${product.image}`}
            alt={product.name}
            className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg tracking-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
          <p className="text-lg font-bold mt-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            €{product.price}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}