import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./login.module.css"
import Union from "../../../public/Union.png"
import Google from "../../../public/Google.png"


const Login = () => {
    const router = useRouter();

    const onSubmit = ({username, password}) => {
        console.log("Logged in " + username + " with pass " + password)
    }

    return (
        <div className={styles.login_master_container}>
            <div className={styles.top_container}>
                <div>
                    <div>
                        Welcome to Jungle Cart
                    </div>
                    <div>
                        Amazon buy, sell, for amazon
                    </div>
                </div>
                <div className="logo">
                    <Image src={Union} alt="JC"></Image>
                </div>
                
            </div>
            <div className={styles.bottom_container}>
                <div className={styles.login_card}>
                    <div className={styles.login_text}>
                        Login
                    </div>
                    <button className={styles.google_button}>
                        Google</button>
                </div>
            </div>
        </div>
    )
}

export default Login;
