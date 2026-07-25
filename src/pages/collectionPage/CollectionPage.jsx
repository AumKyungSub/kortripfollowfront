import React from 'react'

/*------------------------API hooks-----------------------------------*/
// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';
/*------------------------/API hooks-----------------------------------*/

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
// (hook) Read DB
import { useCollectionList } from '@/shared/hooks/useCollectionList'
/*------------------------/custom hooks-----------------------------------*/

//Function Component
import Loading from '@/features/loading/Loading'
import FailedData from '@/features/failedData/FailedData';

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader';
import Footer from '@/widgets/footer/Footer';
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation';
import CollectionBanner from '@/pages/collectionPage/components/collectionBanner/CollectionBanner';
import CollectionList from '@/pages/collectionPage/components/collectionList/CollectionList';
import CollectionGoodsLink from '@/pages/collectionPage/components/collectionGoodsLink/CollectionGoodsLink';

// Page css
import './CollectionPage.style.css'

const CollectionPage = () => {
    // Device Size
    const {
            isFullMobile, /*maxWidth: 767*/ 
    } = useResponsive();
      const {lang} = useLanguage();

  const { collections, loading } = useCollectionList({ lang });

  if (loading) return <div>Loading...</div>;

    return (
        <section>
            <Header />
            <CollectionBanner/>
            <CollectionList collections ={collections}/>
            <CollectionGoodsLink collections ={collections}/>
            <Footer/>
            {isFullMobile && <EmptyFooter/>}
            {isFullMobile && <MobileNavigation/>}
        </section>
    )
}

export default CollectionPage