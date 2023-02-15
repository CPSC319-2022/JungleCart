import { useRouter } from "next/router";
import styles from "../../styles/login.module.css"

const Login = () => {

    const router = useRouter();

    const onSubmit = () => {
        router.push('/products')
    }

    return (
        <div className={styles.login_master_container}>
            <div className={styles.top_container}>
                <div>
                    <div>
                        Welcome to <span className={styles.jungle_cart}>Jungle Cart</span>
                    </div>
                    <div>
                        Amazon buy, sell, for amazon
                    </div>
                </div>
                <div className="logo">
                </div>
            </div>
            <div className={styles.bottom_container}>
                <div className={styles.login_card}>
                    <div className={styles.login_text}>
                        Login
                    </div>
                    <button className={styles.google_button} onClick={() => onSubmit()}>
                        Google</button>
                </div>
            </div>
        </div>
    )
}

export default Login;

