import React, { useEffect, useRef } from 'react';
import { Button, Container, Icon, Text } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeAlert } from './alertSlice';

const Alert: React.FC = () => {
    const dispatch = useAppDispatch();
    const alert = useAppSelector((state) => state.alert);

    const [isClosing, setIsClosing] = React.useState(false);
    const autoCloseTimer = useRef<number | null>(null);

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

    const colorString = `${alert.color}-${alert.intensity}`;
    const textColorClass =
        alert.textColor && alert.textIntensity
            ? `text-${alert.textColor}-${alert.textIntensity}`
            : `text-${colorString}`;

    const handleClose = () => {
        // Stop any pending auto-close
        if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
        }

        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeAlert());
        }, 500);
    };

    return (
        <Container
            animationObject={{
                entranceAnimation: alert.entrance || 'animate__slideInRight',
                exitAnimation: alert.exit || 'animate__slideOutRight',
                isEntering: alert.open && !isClosing,
            }}
            tailwindClasses={`flex-row justify-between gap-10 m-4 p-1 z-50 bg-${colorString}/20 rounded border-2 border-${colorString} absolute bottom-0 right-0`}
        >
            <Text text={alert.body} tailwindClasses={textColorClass} />
            {alert.closeable && (
                <Button onClick={handleClose}>
                    <Icon iconName="X" color={alert.color} intensity={alert.intensity} />
                </Button>
            )}
        </Container>
    );
};

export default Alert;
