import React from 'react';
import { Button, Container } from 'rkitech-components';
import type { HomeProps } from './homeTypes';
import { useAppDispatch } from '../../app/hooks';
import { openAlert } from '../alert/alertSlice';

const Home: React.FC<HomeProps> = () => {
    const dispatch = useAppDispatch();
    return (
        <Container 
            tailwindClasses=''
        >
            <Button onClick={() => {
                dispatch(openAlert({
                    body: "Success message!",
                    closeable: true,
                    color: {
                        bg: { base: { color: "green", intensity: 500 } },
                        text: { base: { color: "green", intensity: 500 } },
                        border: { base: { color: "green", intensity: 700 } }
                    },
                    orientation: "top-right"
                }));
            }}>
                Open Alert
            </Button>
        </Container>
    );
};

export default Home;
