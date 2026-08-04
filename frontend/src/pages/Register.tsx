import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/response";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerSchema, RegisterSchemaType } from "@/validation/auth.validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {User, Calendar, Eye, EyeOff} from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerAuth, isRegistering } = useAuth();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {errors},
    } = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues:  {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "CUSTOMER",
            refCodeInput: "",
        },
    });

    const getInputErrorClass = (hasError:boolean):string => {
        return hasError ? "border-red-500 focus-visible:ring-destructive focus-visible:border-destructive" 
        : "border-slate-300";
    }

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterSchemaType) => {
        setErrorMsg(null);

        try {
            await registerAuth({
                ...data,
                refCodeInput: selectedRole === "ORGANIZER" ? undefined : (data.refCodeInput?.trim() || undefined),
            });
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        }
    };

    return (
        <section id="register" className="w-full min-h-screen bg-[#EFF4FF] flex items-center justify-evenly py-10 px-4 gap-4">
            <div className="hidden md:flex flex-col items-center p-10">
                <h1 className="text-7xl font-bold text-primary">Join The Pulse</h1>
                <p className=" text-2xl text-secondary font-medium mt-2">Temukan dan nikmati pengalaman seru di berbagai event</p>
            </div>
            <Card className="w-full max-w-md bg-white shadow-md border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">Buat Akun Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    {errorMsg && (
                        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <RadioGroup
                            value={selectedRole}
                            onValueChange={(val) => setValue("role", val as "CUSTOMER" | "ORGANIZER", { shouldValidate: true })}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                        >
                            <FieldLabel htmlFor="customer" className="group relative flex cursor-pointer rounded-xl border-2 border-muted bg-popover transition-all hover:bg-primary hover:border-primary has-checked:border-primary has-checked:bg-primary/20">
                                <Field orientation="horizontal">
                                    <User className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5 group-hover:text-white"/>
                                    <FieldContent>
                                        <FieldTitle className="group-hover:text-white font-bold">
                                            Penonton
                                        </FieldTitle>
                                        <FieldDescription className="group-hover:text-white">
                                            Beli tiket event
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="CUSTOMER" id="customer" className="peer sr-only" aria-invalid={!!errors.role} />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="organizer" className="group relative flex cursor-pointer rounded-xl border-2 border-muted bg-popover transition-all hover:bg-primary hover:border-primary has-checked:border-primary has-checked:bg-primary/20">
                                <Field orientation="horizontal">
                                    <Calendar className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5 group-hover:text-white"/>
                                    <FieldContent>
                                        <FieldTitle className="group-hover:text-white font-bold">
                                            Penyelenggara
                                        </FieldTitle>
                                        <FieldDescription className="group-hover:text-white">
                                            Kelola event
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="ORGANIZER" id="organizer" className="peer sr-only" aria-invalid={!!errors.role} />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                        <FieldSet className="w-full">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name" className="text-slate-900 font-bold">
                                        {selectedRole == "ORGANIZER" ? "Nama Organisasi" : "Nama Lengkap (Sesuai KTP)"} <span className="text-destructive">*</span>
                                    </FieldLabel>   
                                    <Input id="name" type="text" className={cn("bg-white text-slate-900 ", getInputErrorClass(!!errors.name))} aria-invalid={!!errors.name} {...register("name")}/>
                                    <FieldError>{errors.name?.message}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-slate-900 font-bold">
                                        E-mail <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input id="email" type="email" className={cn("bg-white text-slate-900", getInputErrorClass(!!errors.email))} aria-invalid={!!errors.email} {...register("email")}/>
                                    <FieldError>{errors.email?.message}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="phone" className="text-slate-900 font-bold">
                                        No. Handphone <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input id="phone" type="text" className={cn("bg-white text-slate-900", getInputErrorClass(!!errors.phone))} aria-invalid={!!errors.phone} {...register("phone")}/>
                                    <FieldError>{errors.phone?.message}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password" className="text-slate-900 font-bold">
                                        Password <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput id="password" type={isVisible ? "text" : "password"} className={cn("bg-white text-slate-900", getInputErrorClass(!!errors.password))} aria-invalid={!!errors.password} {...register("password")}/>
                                        <InputGroupAddon align="inline-end">
                                        <Button variant="ghost" size="icon" type="button" onClick={() => setIsVisible(!isVisible)}>
                                            {isVisible ? <EyeOff/> : <Eye/>}
                                        </Button>
                                            
                                        </InputGroupAddon>
                                        <FieldError>{errors.password?.message}</FieldError>
                                    </InputGroup>
                                </Field>
                                {selectedRole !== "ORGANIZER" && (
                                    <Field>
                                        <FieldLabel htmlFor="refCodeInput" className="text-slate-900 font-bold">
                                            Kode Referal (Optional)
                                        </FieldLabel>
                                        <Input id="refCodeInput" type="text" className="bg-white text-slate-900" aria-invalid={!!errors.refCodeInput} {...register("refCodeInput")}/>
                                        <FieldError>{errors.refCodeInput?.message}</FieldError>
                                    </Field>
                                )}
                            </FieldGroup>

                        </FieldSet>

                        <Button type="submit" disabled={isRegistering} className="w-full mt-2 bg-primary hover:bg-[#FF8C5E] hover:cursor-pointer text-white py-2 rounded-md font-medium">
                            {isRegistering ? "Mendaftar..." : "Daftar Akun"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-[#FF5C00] hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};