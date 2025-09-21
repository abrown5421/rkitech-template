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

    const getColorString = (colorSuffix: { color: string; intensity: number }) => 
        `${colorSuffix.color}-${colorSuffix.intensity}`;

    const drawerBgColor = drawer.color?.bg?.base ? getColorString(drawer.color.bg.base) : "gray-100";

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
                tailwindClasses={`z-40 bg-${drawerBgColor} absolute ${tailwindPosition}`}
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
                                    const textColor = lnk.color?.text?.base 
                                        ? `text-${getColorString(lnk.color.text.base)}`
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
                            const bgColor = act.color.bg?.base ? getColorString(act.color.bg.base) : "blue-500";
                            const textColor = act.color.text?.base ? getColorString(act.color.text.base) : "gray-50";
                            const borderColor = act.color.border?.base ? getColorString(act.color.border.base) : bgColor;
                            const hoverTextColor = act.color.text?.hover ? getColorString(act.color.text.hover) : bgColor;

                            return (
                                <Button
                                    key={idx}
                                    tailwindClasses={`
                                        flex-1 justify-center items-center py-1 px-5 rounded-xl border-2 cursor-pointer text-${textColor}
                                        bg-${bgColor} border-${borderColor} 
                                        hover:bg-transparent hover:text-${hoverTextColor}
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