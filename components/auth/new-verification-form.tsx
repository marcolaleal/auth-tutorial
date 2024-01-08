"use client";

import { useCallback, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "./card-wrapper";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback( () => {
    console.log(token);
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
        <BeatLoader />
      </div>
    </CardWrapper>
  )
}