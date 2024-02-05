"use client";

import * as z from "zod";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsSchema } from "@/schemas";
import { settings } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button"; 
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Form, 
  FormField, 
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { UserRole } from "@prisma/client";

const SettingsPage =  () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPeding, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    }
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      setError(undefined);
      setSuccess(undefined);

      settings(values)
        .then((data) => {
          if(data.error){
            setError(data.error)
          }
          if(data.succsess){
            update();
            setSuccess(data.succsess);
          }
        })
        .catch(() => setError("Algo deu errado aqui..."))
    });
  }

  return (
    <Card className="w-[600px] ">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          ⚙️ Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            className="space-y-6" 
            onSubmit={form.handleSubmit(onSubmit)}
          > 
            <div className="space-y-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {... field}
                        placeholder="John Doe"
                        disabled={isPeding}
                      />                    
                    </FormControl>
                  </FormItem>
                )}  
              />
              {user?.isOAuth === false && (
                <>
                
                  <FormField 
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {... field}
                            placeholder="seu melhor email aqui"
                            disabled={isPeding}
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
                        <FormLabel>
                          Senha
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {... field}
                            placeholder="senha atual"
                            disabled={isPeding}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}  
                  />
                  <FormField 
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nova senha
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {... field}
                            placeholder="nova senha"
                            disabled={isPeding}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}  
                  />
                </>
              )}
              <FormField 
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Permissão
                    </FormLabel>
                    <Select
                      disabled={isPeding}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue  placeholder="Selecionar..."/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>
                          Administrador
                        </SelectItem>
                        <SelectItem value={UserRole.USER}>
                          Usuário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}  
              />
              {user?.isOAuth === false && (
                <FormField 
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className=" flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>
                          Autenticação em dois fatores
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch 
                          disabled={isPeding}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}  
                />
              )}
            </div>
            <FormError  message={error}/>
            <FormSuccess message={success}/>
            <Button
              disabled={isPeding}
              type="submit"
            >
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SettingsPage;
