import React from 'react';
import { Button, Container } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openModal } from '../modal/modalSlice';
import { openAlert } from '../alert/alertSlice';
import { openDrawer } from '../drawer/drawerSlice'; 

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
                    { actionName: "No", actionColor: "gray", actionIntensity: 500, actionFunction: () => console.log("Cancelled!") },
                    { actionName: "Yes", actionColor: "amber", actionIntensity: 500, actionFunction: () => console.log("Confirmed!") },
                ],
            })
        );
    };

    const handleOpenAlert = () => {
        dispatch(
            openAlert({
                body: "This is an alert message!",
                closeable: true,
                color: "emerald",
                intensity: 500,
                entrance: "animate__slideInRight",
                exit: "animate__slideOutRight",
            })
        );
    };

    const handleOpenDrawer = () => {
        dispatch(
            openDrawer({
                title: "Drawer Title",
                color: "gray",
                intensity: 50,
                entrance: "animate__slideInRight",
                exit: "animate__slideOutRight",
                orientation: "right",
                action: [
                    { actionName: "Close", actionColor: "amber", actionIntensity: 500, actionFunction: () => console.log("Drawer action clicked!") }
                ],
                link: [
                    { linkName: "Home", linkFunction: () => console.log("Navigate to profile!") },
                    { linkName: "About", linkFunction: () => console.log("Navigate to profile!") },
                    { linkName: "Docs", linkFunction: () => console.log("Navigate to profile!") },
                ]
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
            <Container tailwindClasses='flex-row gap-4 h-[50px]'>
                <Button onClick={handleOpenModal} tailwindClasses='py-1 px-5 rounded-xl border-2 cursor-pointer text-gray-50 bg-amber-500 border-amber-500 hover:bg-transparent hover:text-amber-500'>
                    Open modal
                </Button>
                <Button onClick={handleOpenAlert} tailwindClasses='py-1 px-5 rounded-xl border-2 cursor-pointer text-gray-50 bg-amber-500 border-amber-500 hover:bg-transparent hover:text-amber-500'>
                    Open alert
                </Button>
                <Button onClick={handleOpenDrawer} tailwindClasses='py-1 px-5 rounded-xl border-2 cursor-pointer text-gray-50 bg-amber-500 border-amber-500 hover:bg-transparent hover:text-amber-500'>
                    Open drawer
                </Button>
            </Container>
        </Container>
    );
};

export default Home;
