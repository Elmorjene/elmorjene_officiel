import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutFormSchema, type CheckoutForm } from "@shared/schema";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useCartStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export function CheckoutForm() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, total, clearCart, setVerificationCode } = useCartStore();
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCodeLocal] = useState("");

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      total: "",
      phoneNumber: "", // Valeur par défaut ajoutée pour le numéro de téléphone
    },
  });
  
  async function onSubmit(data: CheckoutForm) {
    try {
      setIsLoading(true);
      const formData = {
        ...data,
        total: total().toString(),
      };

      await apiRequest("POST", "/api/orders", formData);
      await new Promise(resolve => setTimeout(resolve, 9000));

      setIsLoading(false);
      setShowPayment(false);
      setShowVerification(true);

      // Display a success toast with a hardcoded white background
      toast({
        title: "Succès",
        description: "Votre commande a été passée avec succès !",
        variant: "success",
        className: "bg-white text-black" // White background with black text for contrast
      });

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        setLocation("/");
      }, 3000);

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Échec de la commande. Veuillez réessayer.",
        variant: "destructive",
        className: "bg-white text-black" // Optionally, use white background for error as well
      });
    }
  }


  return (
    <>
      <div className="container max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retourner à la liste
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-card/95">
            <CardHeader>
              <CardTitle className="text-2xl">Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom Complet</FormLabel>
                            <FormControl>
                              <Input {...field} className="transition-colors focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                              <PhoneInput
                                international
                                defaultCountry="US"
                                value={field.value}
                                onChange={field.onChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} className="transition-colors focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addresse</FormLabel>
                          <FormControl>
                            <Input {...field} className="transition-colors focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input {...field} className="transition-colors focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Département</FormLabel>
                            <FormControl>
                              <Input {...field} className="transition-colors focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Postal</FormLabel>
                            <FormControl>
                              <Input {...field} className="transition-colors focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      Total: €{total().toFixed(2)}
                    </div>
                    <Button
                      type="button"
                      size="lg"
                      className="transition-transform hover:scale-105"
                      onClick={() => {
                        form.trigger(["customerName", "email", "address", "city", "state", "zipCode", "phoneNumber"]).then(valid => {
                          if (valid) {
                            setShowPayment(true);
                          }
                        });
                      }}
                    >
                      Procéder au paiement
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPayment && (
          <Dialog open={showPayment} onOpenChange={setShowPayment}>
            <DialogContent className="sm:max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Information de paiement
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de Carte</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              {...field}
                              className="font-mono transition-colors focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date d'expiration</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM/YY"
                                {...field}
                                className="font-mono transition-colors focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="123"
                                {...field}
                                className="font-mono transition-colors focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full transition-all hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Paiement en cours...
                        </motion.div>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
