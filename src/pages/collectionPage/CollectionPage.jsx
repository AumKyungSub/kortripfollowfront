import React from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// (hook) Transition Language
import { useTranslation } from 'react-i18next'

// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';
// (hook) Read DB
import { useCollectionList } from '@/shared/hooks/useCollectionList'

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
            isMobile, /*maxWidth: 479*/
            isFullMobile, /*maxWidth: 767*/ 
            isDesktop /*minWidth: 1024*/
    } = useResponsive();
      const {i18n, t} = useTranslation();
      const lang = i18n.language === "ko" ? "ko" : "en";

  const { collections, loading } = useCollectionList({ lang });

  if (loading) return <div>Loading...</div>;

    return (
        <section>
            <Header />
            <EmptyHeader/>
            <CollectionBanner/>
            <CollectionList collections ={collections} lang = {lang}/>
            <CollectionGoodsLink collections ={collections}/>
            <Footer/>
            {isFullMobile && <EmptyFooter/>}
            {isFullMobile && <MobileNavigation/>}
        </section>
    )
}

export default CollectionPage