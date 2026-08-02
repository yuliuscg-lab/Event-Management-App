import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/response";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginSchemaType } from "@/validation/auth.validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoggingIn } = useAuth();
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues:  {
            email: "",
            password: "",
        },
    });

    const getInputErrorClass = (hasError:boolean):string => {
        return hasError ? "border-red-500 focus-visible:ring-destructive focus-visible:border-destructive" 
        : "border-slate-300";
    }

    const onSubmit = async (data: LoginSchemaType) => {
        setErrorMsg(null);

        try {
            const res = await login(data);
            const userRole = res.data?.user.role;

            if (userRole === "ORGANIZER") {
                navigate("/organizer/portal",{replace:true});
            } else {
                navigate("/", {replace:true});
            }
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        }
    };

    return (
        <section id="login" className="w-full min-h-screen bg-[#EFF4FF] flex items-center justify-evenly py-10 px-4 gap-4">
            <div className="hidden md:flex flex-col items-center p-10">
                <h1 className="text-7xl font-bold text-primary">Find Your Pulse</h1>
                <p className=" text-2xl text-secondary font-medium mt-2">Temukan dan nikmati pengalaman seru di berbagai event</p>
            </div>
            <Card className="w-full max-w-md bg-white shadow-md border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">Masuk Akun Anda</CardTitle>
                </CardHeader>
                <CardContent>
                    {errorMsg && (
                        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FieldSet className="w-full">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-slate-900 font-bold">
                                        E-mail
                                    </FieldLabel>
                                    <Input id="email" type="email" className={cn("bg-white text-slate-900", getInputErrorClass(!!errors.email))} aria-invalid={!!errors.email} {...register("email")}/>
                                    <FieldError>{errors.email?.message}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password" className="text-slate-900 font-bold">
                                        Password
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
                            </FieldGroup>

                        </FieldSet>

                        <Button type="submit" disabled={isLoggingIn} className="w-full mt-2 bg-primary hover:bg-[#FF8C5E] hover:cursor-pointer text-white py-2 rounded-md font-medium">
                            {isLoggingIn ? "Masuk..." : "Masuk Akun"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-[#FF5C00] hover:underline font-medium">
                            Daftar di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
};