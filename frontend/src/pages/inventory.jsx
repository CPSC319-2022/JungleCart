import React from 'react'
import styles from "../styles/Inventory.module.css"
import { products } from '@/seeds/products'
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard'
import { CardTop } from '@/components/organisms/cardTop/CardTop'
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom'
import Separator from '@/components/atoms/separator/Separator'

const InventoryPage = () => {
  
  return (
    <main>
        <section>
          <h2 className='section-header'>Inventory</h2>
          <Separator />
          <div className={styles.gridContainer}>
          {products.products.map(order => (
            <ShadedCard key={order.id}>
              <CardTop {...order}></CardTop>
              <CardBottom className={styles.cardBottom}>
                <div className={styles.col}>
                  <h4>Sold</h4>
                  <p>{order.sold}</p>
                </div>
                <div className={styles.col}>
                  <h4>Remain</h4>
                  <p>{order.total_quantity - order.sold}</p>
                </div>
                <button className={styles.actionButton}>Edit</button>
              </CardBottom>
            </ShadedCard>
            ))}
          </div>
        </section>
    </main>
  )
}

export default InventoryPage
