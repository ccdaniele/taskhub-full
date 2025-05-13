

import React from 'react';

const Card = ({ className, children, ...props }) => {
    const combinedClassName = `card ${className || ''}`;
    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => {
      const combinedClassName = `card-header ${className || ''}`;
    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

const CardTitle = ({ className, children, ...props }) => {
    const combinedClassName = `card-title ${className || ''}`;
    return (
        <h2 className={combinedClassName} {...props}>
            {children}
        </h2>
    );
};

const CardDescription = ({ className, children, ...props }) => {
      const combinedClassName = `card-description ${className || ''}`;
    return (
        <p className={combinedClassName} {...props}>
            {children}
        </p>
    );
};


const CardContent = ({ className, children, ...props }) => {
    const combinedClassName = `card-body ${className || ''}`;
    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

