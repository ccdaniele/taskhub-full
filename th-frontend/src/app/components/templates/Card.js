import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, variant = "default", children, ...props }) => {
    const baseStyles = "card-enhanced shadow-sm hover:shadow-md transition-all duration-300";
    const variants = {
        default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        gradient: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-700",
        glass: "glass-effect dark:glass-effect-dark",
        elevated: "bg-white dark:bg-gray-800 shadow-lg border-0"
    };
    
    return (
        <div 
            className={cn(baseStyles, variants[variant], className)} 
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => {
    return (
        <div 
            className={cn("p-6 pb-3", className)} 
            {...props}
        >
            {children}
        </div>
    );
};

const CardTitle = ({ className, size = "default", children, ...props }) => {
    const sizes = {
        sm: "text-lg font-semibold",
        default: "text-xl font-bold",
        lg: "text-2xl font-bold"
    };
    
    return (
        <h2 
            className={cn(
                sizes[size], 
                "text-gray-900 dark:text-white leading-tight mb-1", 
                className
            )} 
            {...props}
        >
            {children}
        </h2>
    );
};

const CardDescription = ({ className, children, ...props }) => {
    return (
        <p 
            className={cn(
                "text-sm text-gray-600 dark:text-gray-400 leading-relaxed", 
                className
            )} 
            {...props}
        >
            {children}
        </p>
    );
};

const CardContent = ({ className, children, ...props }) => {
    return (
        <div 
            className={cn("px-6 pb-6", className)} 
            {...props}
        >
            {children}
        </div>
    );
};

const CardFooter = ({ className, children, ...props }) => {
    return (
        <div 
            className={cn(
                "px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl", 
                className
            )} 
            {...props}
        >
            {children}
        </div>
    );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
