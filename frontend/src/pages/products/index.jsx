import React from 'react';
import { useRouter } from 'next/router';import { Button } from '@/components/atoms/button/Button';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import crayon from "../../assets/crayon.jpg"
import styles from "../../styles/ProductDetails.module.css";
  

const ProductDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const product = {name: "Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting", 
  price: 12, img:[crayon], description:"Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun."}
  return 
  <><div className={styles.pagebody}>ShadedCard {...product}
  <CardTop {...product}></CardTop>
  <CardBottom className={styles.cardBottom}>
  </CardBottom>
  </div>
  </>
}

export default ProductDetails

