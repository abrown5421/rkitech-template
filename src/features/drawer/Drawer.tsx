import React from 'react';
import { Button, Container, Icon, List, ListItem, Text } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeDrawer } from './drawerSlice';

const Drawer: React.FC = () => {
    const dispatch = useAppDispatch();
    const drawer = useAppSelector((state) => state.drawer);

    const [isClosing, setIsClosing] = React.useState(false);

    const positionClasses = {
        top: "top-0 right-0 left-0 h-1/4",
        right: "right-0 top-0 bottom-0 w-1/5",
        bottom: "bottom-0 right-0 left-0 h-1/4",
        left: "left-0 top-0 bottom-0 w-1/5",
    };

    const tailwindPosition = positionClasses[drawer.orientation ?? "right"];

    if (!drawer.open && !isClosing) return null;

    const colorString = `${drawer.color}-${drawer.intensity}`;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeDrawer());
            setIsClosing(false);
        }, 500);
    };

    return (
        <Container
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: drawer.open && !isClosing,
            }}
            tailwindClasses="w-full h-full justify-center items-center z-50 bg-gray-950/60 absolute top-0"
            onClick={handleClose} 
        >
            <Container
                animationObject={{
                    entranceAnimation: drawer.entrance || 'animate__slideInRight',
                    exitAnimation: drawer.exit || 'animate__slideOutRight',
                    isEntering: drawer.open && !isClosing,
                }}
                tailwindClasses={`z-40 bg-${colorString} absolute ${tailwindPosition}`}
                onClick={(e) => e.stopPropagation()}
            >
                <Container tailwindClasses="flex-col h-full w-full relative">
                    
                    <Container tailwindClasses="flex-row p-2 justify-between">
                        <Text 
                            text={drawer.title || ''} 
                            tailwindClasses="text-xl font-mono text-gray-900" 
                        />
                        <Button tailwindClasses="absolute top-2 right-2 cursor-pointer" onClick={handleClose}>
                            <Icon iconName="X" />
                        </Button>
                    </Container>

                    {drawer.link && drawer.link.length > 0 && (
                        <Container tailwindClasses="p-4">
                            <List variant="unordered" orientation="vertical" gap={3}>
                                {drawer.link.map((lnk, idx) => {
                                    const textColor = lnk.linkTextColor
                                        ? `text-${lnk.linkTextColor}-${lnk.linkTextIntensity}`
                                        : "text-gray-900";

                                    return (
                                        <ListItem 
                                            key={idx} 
                                            iconBullet={lnk.linkIcon || undefined}
                                            tailwindClasses={`cursor-pointer ${textColor}`}
                                            onClick={async () => {
                                                await lnk.linkFunction();
                                                handleClose();
                                            }}
                                        >
                                            {lnk.linkName}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Container>
                    )}

                    <Container tailwindClasses="absolute bottom-2 right-2 left-2">
                        {drawer.action?.map((act, idx) => {
                            const colorString = `${act.actionColor}-${act.actionIntensity}`;
                            const textColor = act.actionTextColor
                                ? `${act.actionTextColor}-${act.actionTextIntensity || act.actionIntensity}`
                                : "gray-50";

                            return (
                                <Button
                                    key={idx}
                                    tailwindClasses={`
                                        flex-1 justify-center items-center py-1 px-5 rounded-xl border-2 cursor-pointer text-${textColor}
                                        bg-${colorString} border-${colorString} 
                                        hover:bg-transparent hover:text-${colorString}
                                    `}
                                    onClick={async () => {
                                        await act.actionFunction();
                                        handleClose();
                                    }}
                                >
                                    {act.actionName}
                                </Button>
                            );
                        })}
                    </Container>
                </Container>
            </Container>
        </Container>
    );
};

export default Drawer;
