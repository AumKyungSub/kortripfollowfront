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
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import Header from '@/widgets/header/Header'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import Footer from '@/widgets/footer/Footer';
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
            {!isFullMobile && <EmptyHeader/>}    
            <CollectionBanner/>
            <CollectionList collections ={collections} lang = {lang}/>
            <CollectionGoodsLink collections ={collections}/>
            {isFullMobile && <EmptyFooter/>}
            <Footer/>
        </section>
    )
}

export default CollectionPage