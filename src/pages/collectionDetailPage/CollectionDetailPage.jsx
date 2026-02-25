import React from 'react'
import { useParams } from "react-router-dom";
import { useCollectionList } from "@/shared/hooks/useCollectionList";
import { useTranslation } from "react-i18next";

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// Components
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import Header from '@/widgets/header/Header'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import Footer from '@/widgets/footer/Footer';
import CollectionDetailPageMain from '@/pages/collectionDetailPage/components/collectionDetailPageMain/CollectionDetailPageMain';
import CollectionDetailPageLink from '@/pages/collectionDetailPage/components/collectionDetailPageLink/CollectionDetailPageLink';
import CollectionGoodsLink from '@/pages/collectionPage/components/collectionGoodsLink/CollectionGoodsLink';

// Page css
import './CollectionDetailPage.style.css'

const CollectionDetailPage = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language === "ko" ? "ko" : "en";

  // Device Size
const {
        isMobile, /*maxWidth: 479*/
        isFullMobile, /*maxWidth: 767*/ 
        isDesktop /*minWidth: 1024*/
} = useResponsive();

  const { collections, loading } = useCollectionList({ lang });

  if (loading) return <div>Loading...</div>;

  const collection = collections.find(
    (item) => item.id === Number(id)
  );

  if (!collection) return <div>Not Found</div>;

  return (
    <>
        <Header />
        {!isFullMobile && <EmptyHeader/>}   
        <section className='collectionDetailPageWrapper'> 
            <CollectionDetailPageMain collection={collection} isFullMobile={isFullMobile}/>
            <CollectionDetailPageLink collection={collection}/>
        </section>
            <CollectionGoodsLink collection={collection}/>
        {isFullMobile && <EmptyFooter/>}
        <Footer/>
    </>
  )
}

export default CollectionDetailPage