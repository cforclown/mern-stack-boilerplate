import React from 'react';
import styled from 'styled-components';

import ErrorView from '../../../Components/Error'



const Container=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50vh;
`

function Page500() {
    return (
        <Container>
            <ErrorView />
        </Container>
    )
}

export default Page500
