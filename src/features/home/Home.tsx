import React from 'react';
import { Button, Container } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openModal } from '../modal/modalSlice';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const activePage = useAppSelector((state) => state.activePage);


    const handleOpenModal = () => {
        dispatch(
            openModal({
                title: "Confirmation",
                body: "Are you sure you want to proceed?",
                closeable: true,
                action: [
                    {
                        actionName: "No",
                        actionColor: "gray",
                        actionIntensity: 500,
                        actionTextColor: "gray",
                        actionTextIntensity: 50,
                        actionFunction: () => {
                            console.log("Cancelled!");
                        },
                    },
                    {
                        actionName: "Yes",
                        actionColor: "amber",
                        actionIntensity: 500,
                        actionTextColor: "gray",
                        actionTextIntensity: 50,
                        actionFunction: () => {
                            console.log("Confirmed!");
                        },
                    },
                ],
            })
        );
    };

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === 'Home'
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5'
        >
            <Button onClick={handleOpenModal}>
                Open modal
            </Button>
        </Container>
    );
};
export default Home;
