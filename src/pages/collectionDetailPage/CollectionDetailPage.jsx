import React from 'react'
/*------------------------hooks-----------------------------------*/
// Params
import { useParams } from "react-router-dom";
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// CollectionList
import { useCollectionList } from "@/shared/hooks/useCollectionList";
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader';
import Footer from '@/widgets/footer/Footer';
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation';
import CollectionDetailPageMain from '@/pages/collectionDetailPage/components/collectionDetailPageMain/CollectionDetailPageMain';
import CollectionDetailPageLink from '@/pages/collectionDetailPage/components/collectionDetailPageLink/CollectionDetailPageLink';
import CollectionGoodsLink from '@/pages/collectionPage/components/collectionGoodsLink/CollectionGoodsLink';

// Page css
import './CollectionDetailPage.style.css'

const CollectionDetailPage = () => {
  const { id } = useParams();
  const {lang} = useLanguage();

  // Device Size
const {
        isFullMobile, /*maxWidth: 767*/ 
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
        <EmptyHeader/>
        <section className='collectionDetailPageWrapper'> 
            <CollectionDetailPageMain collection={collection}/>
            <CollectionDetailPageLink collection={collection}/>
        </section>
            <CollectionGoodsLink collection={collection}/>
        <Footer/>
        {isFullMobile && <EmptyFooter/>}
        {isFullMobile && <MobileNavigation/>}
    </>
  )
}

export default CollectionDetailPage