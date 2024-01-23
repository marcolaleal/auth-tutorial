"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Este email já está sendo usado por um provedor diferente"
    : ""
  ;

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPeding, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if(data?.error){
            setShowTwoFactor(false);
            form.reset();
            setError(data.error);
          }
          if(data?.success){
            form.reset();
            setSuccess(data.success)
          }
          if (data?.twoFactor){
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Algo deu errado"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Bem vindo de volta"
      backButtonLabel="Ainda não tem uma conta? Clique aqui!"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField 
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo de segurança</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        disabled={isPeding}
                        placeholder="digite o codigo aqui..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField 
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPeding}
                          placeholder="John.doe@exemple.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPeding}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">
                          Esqueci minha senha
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPeding}
            className="w-full"
          >
            {showTwoFactor? "Cofnirmar": "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
