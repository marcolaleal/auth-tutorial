"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newVerification } from "@/actions/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string|undefined>();
  const [success, setSuccess] = useState<string|undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback( () => {

    if(!token) {
      setError("Erro ao recuperar o token de validação");
      return;
    };

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error)
      })
      .catch(() => {
        setError("Oops! Algo deu errado!")
      })
  },[token]);

  useEffect(() => {
    onSubmit();
  },[onSubmit]);

  return(
    <CardWrapper
      headerLabel="Confirme sua verificação de email"
      backButtonHref="/auth/login"
      backButtonLabel="Ir para página de login"  
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success}/>
        <FormError message={error}/>
      </div>
    </CardWrapper>
  )
}