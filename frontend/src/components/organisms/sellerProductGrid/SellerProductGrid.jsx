import { ShadedCard } from "../shadedCard/ShadedCard";
import { CardBottom } from "../cardBottom/CardBottom";
import { CardTop } from "../cardTop/CardTop";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { usePopupContext, popupStates } from "@/contexts/PopupContext";

import ordersstyling from '@/pages/orders/Orders.module.css';
import { useUserContext } from "@/contexts/UserContext";
const SellerProductGrid = () => {

    const {user} = useUserContext();
    const { showPopup } = usePopupContext();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(user){
            fetcher({
                url: `/users/${user.id}/seller`,
                method: 'GET',
                token: user.accessToken,  
              }).then((response) => setProducts(response.seller.products))
            .catch((error) => {
              console.log(error);
              //showPopup(popupStates.ERROR, error.message); 
            });
        }
    }, [user])

    const deleteProduct = (product) => {
        //const { showPopup } = usePopupContext();
        fetcher({
        url: `/products/${product?.id}`,
        method: 'DELETE',
        token: user.accessToken,
        }).then((res) => {
        console.log('product ' + `${product?.id}` + ' has been deleted', res);
        showPopup(popupStates.SUCCESS, 'Product deleted from list!'); 
        const remainingProducts = products.filter(p => product.id !== p.id);
        setProducts(remainingProducts)
        }).catch((error) => {
        console.log(error);
        showPopup(popupStates.ERROR, error.message);
        });
    };

    return(
        <div className={ordersstyling.gridContainer}>
            {products?.map((product) => (
                <ShadedCard key={product.id}>
                <CardTop
                    id={product.id}
                    img={""}
                    price={product.price}
                    name={product.name}
                ></CardTop>
                <CardBottom className={ordersstyling.cardBottom}>
                    <button onClick={() => deleteProduct(product)} className={ordersstyling.actionButton}>Delete</button>
                </CardBottom>
                </ShadedCard>
            ))}
        </div>
    )
}

export default SellerProductGrid