import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Image, Text } from 'rkitech-components';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppSelector } from '../../app/hooks';
import type { PageData } from '../../cli/src/features/Pages/types/pageTypes';
import logo from '../../../public/assets/logo.png';

const Footer: React.FC = () => {
    const navigate = useNavigationHook();
    const activePage = useAppSelector((state) => state.activePage);
    const application = useAppSelector((state) => state.application);
    const currentYear = new Date().getFullYear();
    const colorString = application.footer.footerBgColor + '-' + application.footer.footerBgIntensity
    const footerRef = useRef<HTMLDivElement>(null);
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
        if (!footerRef.current) return;

        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            setFooterVisible(true);
            observer.disconnect();
            }
        },
        { threshold: 0.1 }
        );

        observer.observe(footerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <Container tailwindClasses={`flex-row w-full md:min-h-[150px] bg-${colorString} p-4 relative z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]`}>
            <div ref={footerRef} />
            <Container tailwindClasses='flex-col flex-8 justify-between'>
                <Container tailwindClasses='flex-col md:flex-row flex-1 md:items-center gap-4'>  
                    {application.footer.footerPrimaryMenuItems.map((i, index) => {
                        let onClickHandler: () => void;
                        let isActive = false;

                        if (i.itemType === 'page') {
                            const page = application.pages.find((p) => p.pageID === i.itemID) as PageData;
                            if (!page) return null; 
                            isActive = activePage.activePageName === page.pageName;
                            onClickHandler = navigate(page);
                        } else if (i.itemType === 'link') {
                            onClickHandler = () => window.open(i.itemLink || '#', '_blank');
                        } else {
                            return null;
                        }

                        const colorString = isActive
                            ? `text-${i.itemActiveColor}-${i.itemActiveIntensity}`
                            : `text-${i.itemColor}-${i.itemIntensity}`;

                        const hoverString = isActive
                            ? `hover:text-${i.itemColor}-${i.itemIntensity}`
                            : `hover:text-${i.itemHoverColor}-${i.itemHoverIntensity}`;

                        return (
                            <Button
                                key={i.itemID}
                                tailwindClasses={`${colorString} cursor-pointer ${hoverString}`}
                                onClick={onClickHandler}
                                animationObject={{
                                    entranceAnimation: i.itemEntranceAnimation,
                                    exitAnimation: i.itemExitAnimation,
                                    isEntering: footerVisible,
                                    delay: index * 0.25
                                }}
                            >
                                {i.itemName}
                            </Button>
                        );
                    })}
                </Container>
                <Container tailwindClasses='flex md:hidden my-8 flex-col flex-4 justify-center'>right side</Container>
                <Container tailwindClasses='flex-row flex-wrap flex-1 items-center text-sm'>
                    {application.footer.footerCopyright.show && (
                        <div className='text-gray-500'>&copy; {currentYear} {application.footer.footerCopyright.text}</div>
                    )}
                    {application.footer.footerCopyright.show && (
                        <div className='mx-2 text-gray-500'>|</div>
                    )}
                    {application.footer.footerAuxilaryMenuItems.map((i, index) => {
                        let onClickHandler: () => void;
                        let isActive = false;

                        if (i.itemType === 'page') {
                            const page = application.pages.find((p) => p.pageID === i.itemID) as PageData;
                            if (!page) return null; 
                            isActive = activePage.activePageName === page.pageName;
                            onClickHandler = navigate(page);
                        } else if (i.itemType === 'link') {
                            onClickHandler = () => window.open(i.itemLink || '#', '_blank');
                        } else {
                            return null;
                        }

                        const colorString = isActive
                            ? `text-${i.itemActiveColor}-${i.itemActiveIntensity}`
                            : `text-${i.itemColor}-${i.itemIntensity}`;

                        const hoverString = isActive
                            ? `hover:text-${i.itemColor}-${i.itemIntensity}`
                            : `hover:text-${i.itemHoverColor}-${i.itemHoverIntensity}`;

                        return (
                            <React.Fragment key={i.itemID}>
                                <Button
                                    tailwindClasses={`${colorString} cursor-pointer ${hoverString}`}
                                    onClick={onClickHandler}
                                    animationObject={{
                                        entranceAnimation: i.itemEntranceAnimation,
                                        exitAnimation: i.itemExitAnimation,
                                        isEntering: footerVisible,
                                        delay: index * 0.25
                                    }}
                                >
                                    {i.itemName}
                                </Button>
                                {index < application.footer.footerAuxilaryMenuItems.length - 1 && (
                                    <div className='mx-2 text-gray-500'>|</div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Container>
            </Container>
            <Container tailwindClasses='hidden md:flex flex-col flex-4 justify-center items-end'>right side</Container>
        </Container>
    );
};
export default Footer;
