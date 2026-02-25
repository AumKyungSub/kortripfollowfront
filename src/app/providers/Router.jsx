import { BrowserRouter, Routes, Route } from "react-router";

// Components
import Homepage from '@/pages/homePage/Homepage';
import LocationDetailPage from '@/pages/locationDetailPage/LocationDetailPage';
import ListPage from '@/pages/listPage/ListPage';
import SeasonPage from '@/pages/seasonPage/SeasonPage';
import ThemeDetail from '@/pages/themeDetailPage/ThemeDetail';
import CollectionPage from '@/pages/collectionPage/CollectionPage';
import CollectionDetailPage from '@/pages/collectionDetailPage/CollectionDetailPage';
import About from '@/pages/aboutPage/About';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path="/theme" element={<ListPage mode="theme" />} />
                <Route path="/region" element={<ListPage mode="region" />} />
                <Route path='/season' element={<SeasonPage />} />
                <Route path='/themeDetail/:id' element={<ThemeDetail />} />
                <Route path='/location/:id' element={<LocationDetailPage />} />
                <Route path='/collection' element={<CollectionPage />}/>
                <Route path='/collection/:id' element={<CollectionDetailPage />}/>
                <Route path='/about' element={<About />} />
            </Routes>        
        </BrowserRouter>
    );
};

export default Router;