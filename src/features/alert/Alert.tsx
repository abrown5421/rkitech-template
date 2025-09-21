import React, { useEffect, useRef } from 'react';
import { Button, Container, Icon, Text } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeAlert } from './alertSlice';

const Alert: React.FC = () => {
    const dispatch = useAppDispatch();
    const alert = useAppSelector((state) => state.alert);

    const [isClosing, setIsClosing] = React.useState(false);
    const autoCloseTimer = useRef<number | null>(null);

    const positionClasses = {
        "top-left": "top-[50px] left-0",
        "top-center": "top-[50px] left-1/2 -translate-x-1/2",
        "top-right": "top-[50px] right-0",
        "bottom-left": "bottom-0 left-0",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-0 right-0",
    };

    const tailwindPosition = positionClasses[alert.orientation ?? "bottom-right"];

    useEffect(() => {
        if (alert.open) {
            setIsClosing(false);

            if (autoCloseTimer.current !== null) {
                clearTimeout(autoCloseTimer.current);
            }

            autoCloseTimer.current = window.setTimeout(() => {
                handleClose();
            }, 4000) as unknown as number;
            
        }

        return () => {
            if (autoCloseTimer.current) {
                clearTimeout(autoCloseTimer.current);
            }
        };
    }, [alert.open]);

    if (!alert.open && !isClosing) return null;

    const getColorString = (colorSuffix: { color: string; intensity: number }) => 
        `${colorSuffix.color}-${colorSuffix.intensity}`;

    const bgColor = alert.color.bg?.base ? getColorString(alert.color.bg.base) : "emerald-500";
    const borderColor = alert.color.border?.base ? getColorString(alert.color.border.base) : bgColor;
    const textColor = alert.color.text?.base ? getColorString(alert.color.text.base) : "gray-800";

    const backgroundClass = `bg-${bgColor}/20`;
    const borderClass = `border-${borderColor}`;
    const textColorClass = `text-${textColor}`;

    const handleClose = () => {
        if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
        }

        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeAlert());
        }, 500);
    };

    const iconColor = alert.color.bg?.base?.color || "emerald";
    const iconIntensity = alert.color.bg?.base?.intensity || 500;

    return (
        <Container
            animationObject={{
                entranceAnimation: alert.entrance || 'animate__slideInRight',
                exitAnimation: alert.exit || 'animate__slideOutRight',
                isEntering: alert.open && !isClosing,
            }}
            tailwindClasses={`flex-row justify-between gap-10 m-4 p-1 z-50 ${backgroundClass} rounded border-2 ${borderClass} absolute ${tailwindPosition}`}
        >
            <Text text={alert.body} tailwindClasses={textColorClass} />
            {alert.closeable && (
                <Button onClick={handleClose}>
                    <Icon iconName="X" color={iconColor} intensity={iconIntensity} />
                </Button>
            )}
        </Container>
    );
};

export default Alert;