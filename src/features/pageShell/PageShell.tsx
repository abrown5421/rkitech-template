import React, { useEffect } from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import Home from '../home/Home';
import type { PageData } from '../../cli/src/shared/types/pageTypes';


const PageShell: React.FC<PageData> = ({
    pageName,
    pageColor,
    pageIntensity,
    pageEntranceAnimation,
    pageExitAnimation
}) => {
    const activePage = useAppSelector((state) => state.activePage);
    const colorString = pageColor + '-' + pageIntensity;
    
    useEffect(()=>{console.log(activePage)}, [activePage])

    return (
        <Container 
            animationObject={{
                entranceAnimation: pageEntranceAnimation ?? 'animate__fadeInUpBig',
                exitAnimation: pageExitAnimation ?? 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === pageName
            }}
            tailwindClasses={`h-[calc(100vh-54px)] p-5 bg-${colorString}`}
        >                
            {activePage.activePageName === 'Home' && <Home />}    
            {/* add hard coded pages here */}
            
            {/* cli pages should appear here */}

        </Container>
    );
};

export default PageShell;
