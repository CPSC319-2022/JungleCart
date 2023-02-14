import { Button } from '@/components/atoms/button/Button';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import crayon from "../assets/crayon.jpg"
import styles from '../styles/Home.module.css';

export default function Home() {
  const product = {name: "product 1", price: 12, img:[crayon]}
  return <div>Home Page</div>;
}
