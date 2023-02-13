import { Button } from '@/components/atoms/button/Button';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { useRouter } from 'next/router';
import crayon from "../../assets/crayon.jpg"
import styles from '../../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const product = {name: "product 1", price: 12, img:[crayon]}
  return <div><ShadedCard {...product}>
    <CardTop {...product}></CardTop>
    <CardBottom className={styles.cardBottom}>
      <div className={styles.soldColumn}>
        <p>Sold</p>
        <p>1</p>
      </div>
      <div className={styles.remainColumn}>
        <p>Remain</p>
        <p>1</p>
      </div>
      <button className={styles.deleteButton}>Delete</button>
      <button className={styles.deleteButton} onClick={() => router.push('/products/1')}>View</button>
    </CardBottom>
    </ShadedCard></div>;
}