import React from 'react';
import Core from './Core/core';
import Footer from './Footer/footer';
import Header from './Header/header';

const Home = (props) => {

    return (
        <div>
            <Header />
            <Core />
            <Footer />
        </div>
    );
}

export default Home;