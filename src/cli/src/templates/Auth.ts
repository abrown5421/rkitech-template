export const authTemplate = (componentName: string, folderName: string): string => 
`import React, { useState } from 'react';
import { Button, Container, Icon, Input, Text } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { startLoading, stopLoading } from '../loader/loadingSlice';
import GlobalLoader from '../loader/GlobalLoader';
import { setActivePageIn } from '../pageShell/activePageSlice';

const ${componentName}: React.FC<${componentName}Props> = () => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.loading["auth"] ?? false);
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
    });

    const isSignup = mode === "signup";

    const validators = {
        email: (email: string) => {
            if (!email) return "Email is required";
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) return "Invalid email address";
            return "";
        },
        password: (password: string) => {
            if (!password) return "Password is required";
            const policyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?]).{8,}$/;
            if (!policyRegex.test(password)) {
                return "Password must contain uppercase, lowercase, number, special character and be at least 8 characters";
            }
            return "";
        },
        firstName: (name: string) => !name?.trim() ? "First name is required" : ""
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const newErrors = {
            email: validators.email(formData.email),
            password: validators.password(formData.password),
            firstName: isSignup ? validators.firstName(formData.firstName) : "",
            confirmPassword: isSignup && formData.password !== formData.confirmPassword 
                ? "Passwords do not match" : ""
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async () => {
        dispatch(startLoading("auth"));

        try {
            if (!validateForm()) return;

            await new Promise(res => setTimeout(res, 1500));

            if (isSignup) {
                console.log("Signing up with:", {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    password: formData.password
                });
            } else {
                console.log("Logging in with:", {
                    email: formData.email,
                    password: formData.password
                });
            }
        } finally {
            dispatch(stopLoading("auth"));
        }
    };

    const toggleMode = () => {
        dispatch(setActivePageIn(false));
        setTimeout(() => {
            setMode(prev => prev === "login" ? "signup" : "login");
            dispatch(setActivePageIn(true));
        }, 500);
    };

    const renderInput = (field: keyof typeof formData, label: string, baseType = "text") => {
        const isPasswordField = field === "password" || field === "confirmPassword";
        const inputType = isPasswordField ? (showPassword ? "text" : "password") : baseType;
        
        return (
            <Input
                label={label}
                type={inputType}
                value={formData[field]}
                onChange={(e) => updateField(field, e.target.value)}
                error={!!errors[field as keyof typeof errors]}
                helperText={errors[field as keyof typeof errors]}
                tailwindClasses='mb-4'
                {...(isPasswordField ? {
                    endAdornment: (
                        <Button onClick={() => setShowPassword(prev => !prev)} tailwindClasses="p-1">
                            <Icon iconName={showPassword ? 'EyeClosed' : 'Eye'} />
                        </Button>
                    )
                } : {})}
            />
        );
    };

    return (

        <Container tailwindClasses='flex-row w-full min-h-[calc(100vh-50px)] p-5 justify-center items-center'>

            <Container tailwindClasses='flex-col justify-center items-center w-full md:w-1/3 bg-gray-50 rounded-xl p-4'>
                <Text 
                    text={isSignup ? 'Sign Up' : 'Login'} 
                    tailwindClasses='text-3xl font-mono text-gray-900 mb-4' 
                />

                {isSignup && (
                    <>
                        {renderInput("firstName", "First Name")}
                        {renderInput("lastName", "Last Name (Optional)", "text")}
                    </>
                )}

                {renderInput("email", "Email", "email")}
                {renderInput("password", "Password", "password")}

                {isSignup && renderInput("confirmPassword", "Confirm Password", "password")}

                <Button
                    onClick={handleSubmit}
                    tailwindClasses='mb-4 bg-amber-500 text-white border-2 border-amber-500 py-1 px-4 rounded-xl cursor-pointer hover:text-amber-500 hover:bg-transparent'
                >
                    {isLoading ? (
                        <GlobalLoader target="auth" type='Dots' variant={5} color='gray' intensity={50} size={6} />
                    ) : (
                        isSignup ? "Sign Up" : "Login"
                    )}
                </Button>

                <Button onClick={toggleMode} tailwindClasses='text-gray-900 text-sm underline'>
                    {isSignup ? "Already have an account? Login." : "Don't have an account? Sign Up"}
                </Button>
            </Container>
        </Container>
    );
};

export default ${componentName};
`