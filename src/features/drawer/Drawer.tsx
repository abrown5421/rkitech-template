import React, { useEffect, useRef } from 'react';
import { Container } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeDrawer } from './drawerSlice';

const Drawer: React.FC = () => {
    const dispatch = useAppDispatch();
    const drawer = useAppSelector((state) => state.drawer);

    const [isClosing, setIsClosing] = React.useState(false);
    const autoCloseTimer = useRef<number | null>(null);

    const positionClasses = {
        "top": "top-0",
        "right": "right-0",
        "bottom": "bottom-0",
        "left": "left-0",
    };

    const tailwindPosition = positionClasses[drawer.orientation ?? "right"];

    useEffect(() => {
        if (drawer.open) {
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
    }, [drawer.open]);

    if (!drawer.open && !isClosing) return null;

    const colorString = `${drawer.color}-${drawer.intensity}`;

    const handleClose = () => {
        if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
        }

        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeDrawer());
        }, 500);
    };

    return (
        <Container
            animationObject={{
                entranceAnimation: drawer.entrance || 'animate__slideInRight',
                exitAnimation: drawer.exit || 'animate__slideOutRight',
                isEntering: drawer.open && !isClosing,
            }}
            tailwindClasses={`z-40 bg-${colorString} absolute ${tailwindPosition}`}
        >
            test
        </Container>
    );
};

export default Drawer;
