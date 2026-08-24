import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Homepage from '@/pages/homePage/Homepage';
import LocationDetailPage from '@/pages/locationDetailPage/LocationDetailPage';
import ListPage from '@/pages/listPage/ListPage';
import SeasonPage from '@/pages/seasonPage/SeasonPage';
import ThemeDetail from '@/pages/themeDetailPage/ThemeDetail';
import CollectionPage from '@/pages/collectionPage/CollectionPage';
import CollectionDetailPage from '@/pages/collectionDetailPage/CollectionDetailPage';
import About from '@/pages/aboutPage/About';
import LegalPage from '@/pages/legalPage/LegalPage';
import MemberPage from '@/pages/memberPage/MemberPage';
import CourseDetailPage from '@/pages/courseDetailPage/CourseDetailPage';
import CourseListPage from '@/pages/courseListPage/CourseListPage';
import OperatorTourApiPage from '@/pages/operatorTourApiPage/OperatorTourApiPage';
import ExternalPlaceDetailPage from '@/pages/externalPlaceDetailPage/ExternalPlaceDetailPage';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path="/theme" element={<ListPage mode="theme" />} />
                <Route path="/region" element={<ListPage mode="region" />} />
                {/* <Route path='/season' element={<SeasonPage />} /> */}
                <Route path='/theme/:category/:id' element={<ThemeDetail />} />
                <Route path='/location/:id' element={<LocationDetailPage />} />
                <Route path='/external-place/:id' element={<ExternalPlaceDetailPage />} />
                <Route path='/collection' element={<CollectionPage />}/>
                <Route path='/collection/:id' element={<CollectionDetailPage />}/>
                <Route path='/about' element={<About />} />
                <Route path='/privacy' element={<LegalPage type="privacy" />} />
                <Route path='/terms' element={<LegalPage type="terms" />} />
                <Route path='/myTravel' element={<MemberPage />} />
                <Route path='/courses' element={<CourseListPage />} />
                <Route path='/itineraries/:id' element={<CourseDetailPage />} />
                <Route path='/operator/tour-api' element={<OperatorTourApiPage />} />
            </Routes>        
        </BrowserRouter>
    );
};

export default Router;
