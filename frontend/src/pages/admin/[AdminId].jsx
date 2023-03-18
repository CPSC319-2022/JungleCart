//import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/components/organisms/userCard/UserCard.module.css'

// img is also needed for the Image component
export const AdminDashboard = ({ id }) => {
  const router = useRouter();
  //const { showPopup } = usePopupContext();
  const AdminId = router.query.AdminId;
  if (!AdminId) {
    return <div></div>
   }
  const routeToAdmin = async () => {
    router.push(`${AdminId}`);
  }
    
    /*method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({AdminId: id }),
    })
      .then((response) => response.json())
      .then(() => {
        router.push(`/admins/${AdminId}`)
      });
  };*/

  return (
    <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src="../../../assets/Icon-User-green.svg"
            alt="PNG User image"
            fill
            onClick={() => router.push(`/admin/${id}`)}
          />
        </figure>
      </div>
      <div className={styles.info}>
        <div
          className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
          data-tip={id}
        >
          <h2 className={styles.title}>User {id}</h2>
        </div>
        <div className="w-full flex justify-between">
          
          <button className={styles.button} onClick={routeToAdmin}>
            To Admin `${AdminId}`
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;