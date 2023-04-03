import { useUserContext } from "@/contexts/UserContext";
import { useAddresses } from "@/hooks/useAddresses";
import { useState } from "react";
import { fetcher } from "@/lib/api";
import { Pulser } from "@/components/atoms/pulser/Pulser";
import styles from "./addressPick.module.css"
import Separator from "@/components/atoms/separator/Separator";
import AddAddressModal from "../modals/AddAddressModal";
import EditAddressModal from "../modals/EditAddressModal";
import ConfirmationModal from "../modals/ConfirmationModal";

export const AddressPick = () => {

  const { user } = useUserContext();
  const { data: addresses, loading,  triggerFetch: triggerAddressFetch } = useAddresses();
  
  const [show_edit_address_modal, setShowEditAddressModal] = useState(false);
  const [show_confirmation_modal, setShowConfirmationModal] = useState(false);
  
  const [focus_address, setFocusAddress] = useState({});
    
  const onAddressRemove = (addr_id) => {
    let addr =
      addresses?.other_address?.filter((addr) => addr.id == addr_id)[0] ??
      addresses?.preferred_address;
    setFocusAddress(addr);
    setShowConfirmationModal(true);
    
  };

  const onRemoveAddressSubmit = (addr_id) => {
    fetcher({
      url:`/users/${user.id}/addresses/${addr_id}`,
      token: user.accessToken,
      method: "DELETE",
    }).then(() => {
      triggerAddressFetch();
      setShowConfirmationModal(false);
      setFocusAddress({});
    })

  };

  const onAddressEdit = (addr_id) => {
    let inPreffered_address = addresses?.preferred_address?.id == addr_id
    let addr = inPreffered_address ? addresses?.preferred_address : 
      addresses?.other_address?.filter((addr) => addr.id == addr_id)[0]
    addr.preferred = inPreffered_address
    console.log(addr)
    setFocusAddress(addr);
    setShowEditAddressModal(true);
  };

  const onAddressEditSubmit = (
    id,
    preferred,
    recipient,
    address_line_1,
    address_line_2,
    city,
    province,
    postal_code,
    telephone
  ) => {
    fetcher({
      url:`/users/${user.id}/addresses/${id}`,
      token: user.accessToken,
      method: "PUT",
      body: {
        address: {
          preferred,
          recipient,
          address_line_1,
          address_line_2,
          city,
          province,
          postal_code,
          telephone
        }
      },
    }).then(() => triggerAddressFetch())
    setShowEditAddressModal(false);
    setFocusAddress({});
  };

  const setDefaultAddress = (addr_id) => {
    console.log(addr_id);
    let addr =
      addresses?.other_address?.filter((addr) => addr.id == addr_id)[0] ??
      addresses?.preferred_address;
    fetcher({
      url: `/users/${user.id}/addresses/${addr_id}`,
      method: "PUT",
      body: {
        address: {
          preferred: true,
          recipient: addr.recipient,
          city: addr.city,
          province: addr.province,
          postal_code: addr.postal_code,
          telephone: addr.telephone,
          address_line_1: addr.address_line_1,
          address_line_2: addr.address_line_2,
        }
      }
    }).then(() => triggerAddressFetch());
  };

  const onAddAddressSubmit = async (
    recipient,
    address_line1,
    address_line2,
    city,
    province,
    postal_code,
    telephone
  ) => {
    console.log(
      recipient,
      address_line1,
      address_line2,
      city,
      province,
      postal_code
    );
    const preferred = addresses.preferred_address.id == undefined;
    return fetcher({
      url: `/users/${user.id}/addresses`,
      method: 'POST',
      token: user.accessToken,
      body: {
        address: {
          preferred,
          recipient,
          address_line_1: address_line1,
          address_line_2: address_line2,
          city,
          province,
          postal_code,
          telephone
        },
      },
    }).then((res) => {
      triggerAddressFetch();
      console.log({ res })
    });
  };

    return (
        <>
    <section>
    <div className="flex justify-between">
      <div className="section-header">Addresses</div>
      <label
        htmlFor="add-address"
        className={`${styles.bgprimary} cursor-pointer rounded-xl pl-5 pr-5 flex justify-center items-center text-white`}
      >
        Add
      </label>
    </div>
    {loading && 
      <main>
        <section>
          <Pulser />
        </section>
      </main>}
    <Separator />
    {addresses?.preferred_address?.id != undefined ? (
      <div className={styles.bottom_container}>
        <div className={styles.profile_content_card}>
          <div className={styles.default_badge}>default</div>
          <div className="grow ">
            <div className="font-bold">
              {addresses?.preferred_address?.recipient}
            </div>
            <div className="leading-6">
              {addresses?.preferred_address?.address_line_1}
            </div>
            <div className="leading-6">
              {addresses?.preferred_address?.address_line_2}
            </div>
            <div className="leading-6">
              {addresses?.preferred_address?.city},{' '}
              {addresses?.preferred_address?.province},{' '}
              {addresses?.preferred_address?.postal_code}
            </div>
            <div className="leading-6">
              {addresses?.preferred_address?.telephone}
            </div>
            <div className="flex justify-between">
              <div
                onClick={() =>
                  onAddressEdit(addresses?.preferred_address?.id)
                }
                className="font-bold text-warning cursor-pointer"
              >
                Edit
              </div>
            </div>
          </div>
        </div>
        {addresses?.other_address?.map((addr) => {
          return (
            <div key={addr.id} className={styles.profile_content_card}>
              <div
                className={styles.setdefault}
                onClick={() => setDefaultAddress(addr.id)}
              >
                Set default
              </div>
              <div className="grow ">
                <div className="font-bold">{addr.recipient}</div>
                <div className="leading-6">{addr.address_line_1}</div>
                <div className="leading-6">{addr.address_line_2}</div>
                <div className="leading-6">
                  {addr.city}, {addr.province}, {addr.postal_code}
                </div>
                <div className="leading-6">{addr.telephone}</div>
                <div className="flex justify-between">
                  <div
                    onClick={() => onAddressEdit(addr.id)}
                    className="font-bold text-warning cursor-pointer"
                  >
                    Edit
                  </div>
                  <div
                    onClick={() => onAddressRemove(addr.id)}
                    className="font-bold text-error cursor-pointer"
                  >
                    Remove
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : !loading &&  (
      <div className="w-full flex flex-col items-center">
        Please add an address to get started
      </div>
    )}
  </section>
  <AddAddressModal onSubmit={onAddAddressSubmit} />
    <EditAddressModal
    initialAddress={focus_address}
    show={show_edit_address_modal}
    toggle={() => setShowEditAddressModal(false)}
    onSubmit={onAddressEditSubmit}
    />
    
    <ConfirmationModal
        show={show_confirmation_modal}
        toggle={() => setShowConfirmationModal(false)}
        onApprove={() => onRemoveAddressSubmit(focus_address?.id)}
      />
  </>
  )
}