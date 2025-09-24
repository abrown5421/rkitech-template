import React from 'react';
import { Button, Container } from 'rkitech-components';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppSelector } from '../../app/hooks';
import type { PageData } from '../../cli/src/features/Pages/types/pageTypes';
import { getThemeColorKey } from '../../utils/getThemeColorKey';

const Footer: React.FC = () => {
    const navigate = useNavigationHook();
    const activePage = useAppSelector((state) => state.activePage);
    const application = useAppSelector((state) => state.application);
    const currentYear = new Date().getFullYear();
    
    const colorString = !application.footer.footerBgIntensity
          ? getThemeColorKey(application.footer.footerBgColor)
            ? `${application.theme[application.footer.footerBgColor].color}-${application.theme[application.footer.footerBgColor].intensity}`
            : 'amber-500'
          : `${application.footer.footerBgColor}-${application.footer.footerBgIntensity}`;

    const getColorClass = (color: any, intensity: any, prefix: string = 'text') => {
        if (intensity === false) {
            return getThemeColorKey(color)
                ? `${prefix}-${application.theme[color].color}-${application.theme[color].intensity}`
                : `${prefix}-amber-500`;
        }
        return `${prefix}-${color}-${intensity}`;
    };

    const renderMenuItem = (i: any) => {
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

        const colorClass = isActive
            ? getColorClass(i.itemActiveColor, i.itemActiveIntensity)
            : getColorClass(i.itemColor, i.itemIntensity);

        const hoverClass = isActive
            ? `hover:${getColorClass(i.itemColor, i.itemIntensity)}`
            : `hover:${getColorClass(i.itemHoverColor, i.itemHoverIntensity)}`;

        return (
            <Button
                key={i.itemID}
                tailwindClasses={`${colorClass} cursor-pointer ${hoverClass}`}
                onClick={onClickHandler}
            >
                {i.itemName}
            </Button>
        );
    };

    return (
        <Container tailwindClasses={`flex-row w-full min-h-[150px] bg-${colorString} p-4 relative z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]`}>
            <Container tailwindClasses='flex-col flex-8 justify-between'>
                <Container tailwindClasses='flex-row flex-1 items-center gap-4'>  
                    {application.footer.footerPrimaryMenuItems.map(renderMenuItem)}
                </Container>
                <Container tailwindClasses='flex-row flex-1 items-center text-sm'>
                    {application.footer.footerCopyright.show && (
                        <div className='text-gray-500'>&copy; {currentYear} {application.footer.footerCopyright.text}</div>
                    )}
                    {application.footer.footerCopyright.show && (
                        <div className='mx-2 text-gray-500'>|</div>
                    )}
                    {application.footer.footerAuxilaryMenuItems.map((i, index) => (
                        <React.Fragment key={i.itemID}>
                            {renderMenuItem(i)}
                            {index < application.footer.footerAuxilaryMenuItems.length - 1 && (
                                <div className='mx-2 text-gray-500'>|</div>
                            )}
                        </React.Fragment>
                    ))}
                </Container>
            </Container>
            <Container tailwindClasses='flex-col flex-4 justify-center items-end'>right side</Container>
        </Container>
    );
};

export default Footer;