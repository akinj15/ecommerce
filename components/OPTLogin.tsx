/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth, db } from "@/lib/firebase/instances";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { LuPhone } from "react-icons/lu";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/format";
import { createClienteById } from "@/lib/firebase/querys/setUSer";

export const OPTLogin = () => {
  const { toast } = useToast();
  
  const [telefone, setTelefone] = useState<string>("");
  const [opt, setOpt] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );

    setRecaptchaVerifier(recaptchaVerifier);
    return () => {
      recaptchaVerifier.clear();
    };
  }, [confirmationResult]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown -1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const hasEnteredAllDigits = opt?.length === 6;
    if (hasEnteredAllDigits) {
      verifyOpt();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opt]);

  const verifyOpt = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Por favor, solicite o codigo de confirmação.");
        return;
      }

      try {
        confirmationResult?.confirm(opt || "").then((e) => {
          createClienteById(db, e.user.uid, { telefone: telefone });
          toast({
            title: "Codigo Verificado com sucesso.",
          });
        });
      } catch (e) {
        console.log(e);
        setError("Falha ao verificar o codigod e confirmação");
      }
    });
  };

  const requestOPT = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountdown(60);
    
    startTransition(async () => {
      setError("")
      if (!recaptchaVerifier) {
        return setError("O Captcha não foi inicializado corretamente.");
      }
      try {
        const numero = "+55" + telefone.replace(/\D/gim, "");
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          numero,
          recaptchaVerifier,
        );
        
        setConfirmationResult(confirmationResult);
        
        setSuccess("Codigo enviado com sucesso.");
      } catch (e: any) {
        setResendCountdown(0)
        if (e.code === "auth/invalid-phone-number") {
          setError(
            "Numero de Telefone inválido, porfavor cheque e tente novamente."
          );
        } else if (e.code === "auth/too-many-requests") {
          setError(
            "Foram feitas muitas tentativas, porfavor tente mais tarde."
          );
        } else {
          setError(
            "Falha ao enviar o codigo de verificação, tente novamente."
          );
        }
      }

    });
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Faça login com seu numero de telefone
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!confirmationResult && (
              <form id="telefone-form" onSubmit={requestOPT}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="Digite seu numero de telefone."
                        value={telefone}
                        onChange={(e) => setTelefone(formatNumber(e.target.value))}
                        className="pl-10"
                      />
                      <LuPhone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </form>
            )}
            <div id="recaptcha-container" className="mt-2" />

            {confirmationResult && (
              <form id="telefone-form" onSubmit={requestOPT}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Inform o codigo de verificação</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={opt}
                        onChange={(value) => setOpt(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="submit"
              form="telefone-form"
              className="w-full"
              disabled={!telefone || isPending || resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Renviar Codigo em ${resendCountdown} `
                : isPending
                ? "Enviando Codigo "
                : "Enviar Codigo "}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
