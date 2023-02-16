import React, {useState, useEffect} from "react"
import Image from "next/image"
import { Button } from "@/components/atoms/button/Button"
import styles from "@/styles/SellerDashboard.module.css"
import Separator from "@/components/atoms/separator/Separator"
import EditIcon from "../../../public/edit_green.svg"
import { useRouter } from "next/router"

const SellerDashboard = () => {
    const router = useRouter();

    const [user, setUser] = useState({})

    useEffect(() => {
        fetch("http://localhost:10010/v2/users/1")
            .then(response => response.json())
            .then(data => {
                setUser(data.user)
            })
    }, [])

    const onViewStore = () => {
        router.push("/inventory")
    }

    return(
        <main >
            <section className="section-header">
                <div className={styles.top_container}>
                    <h2 className={"sectionHeader "}>{`Hello ${user.first_name}`}</h2>
                    <Button onClick={() => onViewStore()}>View Store</Button>
                </div>
                <Separator></Separator>
                <div className={styles.bottom_container}>
                    <div className={`${styles.card} ${styles.user_card}`}>
                        {user.email}<br></br>
                        description
                        <button className={styles.edit_button}><Image src={EditIcon} alt="edit"/></button>
                    </div>
                    <div className={`${styles.card} ${styles.item_card}`}>
                        <div className={styles.justify_between}>
                            <div>Total Products</div>
                            <div>0</div>
                        </div>
                        <div className={styles.justify_between}>
                            <div>Remaining Items</div>
                            <div>0</div>
                        </div>
                    </div>
                </div>
                
            </section>
        </main>
    )
}

export default SellerDashboard