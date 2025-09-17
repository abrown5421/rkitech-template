import React from 'react';
import { Button, Container, Text } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModal } from './modalSlice';

const Modal: React.FC = () => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);

    const [isClosing, setIsClosing] = React.useState(false);
    const [isOverlayClosing, setIsOverlayClosing] = React.useState(false);

    if (!modal.open && !isClosing && !isOverlayClosing) return null;

    const handleClose = async () => {
        setIsClosing(true);
        try {
            setTimeout(() => {
                setIsClosing(false);
                setIsOverlayClosing(true);

                setTimeout(() => {
                    setIsOverlayClosing(false);
                }, 300);                
            }, 500);
        } finally {
            setTimeout(() => {
                dispatch(closeModal())          
            }, 500);
        }
    };
    
    return (
        <Container
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: modal.open && !isOverlayClosing,
            }}
            tailwindClasses="w-full h-full justify-center items-center z-50 bg-gray-950/60 absolute top-0"
        >
            <Container
                animationObject={{
                    entranceAnimation: modal.entrance || 'animate__flipInX',
                    exitAnimation: modal.exit || 'animate__flipOutX',
                    isEntering: modal.open && !isClosing,
                }}
                tailwindClasses="flex-col bg-gray-50 rounded-2xl p-4 m-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
                <Text text={modal.title} tailwindClasses="text-xl font-mono text-gray-900" />
                <Text text={modal.body} tailwindClasses="mt-2" />
                <div className="mt-6 h-px bg-gray-300 w-full" />
                <Container tailwindClasses="mt-4 flex justify-end gap-2">
                    {modal.action.map((act, idx) => {
                        const colorString = `${act.actionColor}-${act.actionIntensity}`;
                        const textColor = act.actionTextColor
                            ? `${act.actionTextColor}-${act.actionTextIntensity || act.actionIntensity}`
                            : 'gray-50';

                        return (
                            <Button
                                key={idx}
                                tailwindClasses={`
                                    py-1 px-5 rounded-xl border-2 cursor-pointer text-${textColor}
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
    );
};

export default Modal;
