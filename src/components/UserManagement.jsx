import { useEffect, useState } from "react";
import cancel from "../assets/images/icons/cancelRed.png";
import garbage from "../assets/images/icons/garbage.png";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TitleCard } from "../components/shared/TitleCard";
import { ButtonCloseWindow } from "../components/shared/ButtonCloseWindow";
import { useAxios } from "../hooks/useAxios";
import { serverURL } from "../constants/constants";
import { useSelector } from "react-redux";

const rootElement = document.getElementById("root");

Modal.setAppElement(rootElement);

export const UserManagement = () => {
  const token = useSelector((state) => state.user.adminToken);
  const id = useSelector((state) => state.user.adminId);

  const { data, setData, _setData, _data } = useAxios(
    `${serverURL}/api/admins/usersList/${id}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );

  const [user, setUser] = useState(data);
  const [_user, _setUser] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [subscriptionExp, setSubscriptionExp] = useState(null);
  const [date, setDate] = useState(null);
  const [isUserSet, setIsUserSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [localDate, setLocalDate] = useState("");

  // const setMembers = () => {
  //   if (isUserSet) {
  //     return;
  //   } else {
  //     setUser(data);
  //     _setUser(data);
  //     setIsUserSet(true);
  //   }
  // };

  // useEffect(() => {
  //   setMembers();
  // }, [data]);

  console.log(user);

  const searchMember = (event) => {
    const title = event.target.value.toLowerCase();
    const search = [..._data].filter((a) =>
      a.name.toLowerCase().includes(title)
    );
    setData(search);
    setSearchValue(event.target.value);
    return;
  };

  const clearSearchText = () => {
    setSearchValue("");
    setData(_data);
    return;
  };

  const deleteUser = () => {
    setData((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    _setData((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    notifyDeleted();
    setIsModalOpen(false);
    setUserId(null);
    return;
  };

  const isSubscribedExpired = (subscritionExp) => {
    const now = new Date().getTime();
    const cardExp = new Date(
      subscritionExp.split("/").reverse().join("/")
    ).getTime();
    return now >= cardExp;
  };

  const isCardExpired = (cardExpiry) => {
    const now = new Date().getTime();
    const cardExp = new Date(
      cardExpiry.split("/").reverse().join("/")
    ).getTime();
    return now >= cardExp;
  };

  let renewalDate;
  const convertDate = (date) => {
    renewalDate = new Date(date);

    renewalDate = date.toLocaleDateString();
  };

  const handleSubscriptionExpChange = (value) => {
    const newDate = value.toLocaleDateString();
    setData((prevUsers) =>
      prevUsers.map((item) => {
        return item.id === date ? { ...item, subscritionExp: newDate } : item;
      })
    );
    setIsCalendarOpen(false);
    notifySubscription();
  };

  const openCalendar = (id) => {
    setIsCalendarOpen(true);
    setDate(id);
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const openDeleteModals = (value, id) => {
    setIsModalOpen(value);
    setUserId(id);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const selectChoose = (event) => {
    const selected = event.target.value;
    let order = [...data];

    switch (selected) {
      case "default":
        order.sort((a, b) => (a.id > b.id ? 1 : -1));
        break;
      case "nome":
        order.sort((a, b) => (a.name > b.name ? 1 : -1));
        break;
      case "scheda":
        order.sort((a, b) => {
          const dateA = new Date(
            (a.cardExpiry ?? "01/01/2020").split("/").reverse().join("/")
          ).getTime();
          const dateB = new Date(
            (b.cardExpiry ?? "01/01/2020").split("/").reverse().join("/")
          ).getTime();
          return dateA - dateB;
        });
        break;
      case "abbonamento":
        order.sort((a, b) => {
          const dateA = new Date(
            a.subscritionExp.split("/").reverse().join("/")
          ).getTime();
          const dateB = new Date(
            b.subscritionExp.split("/").reverse().join("/")
          ).getTime();
          return dateA - dateB;
        });
        break;
      default:
        break;
    }
    setData(order);
  };

  const notifySubscription = () =>
    toast.success("Rinnovato con successo!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyDeleted = () =>
    toast.success("Utente eliminato con successo!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  return (
    <>
      <ToastContainer
        toastStyle={{ backgroundColor: "#F87A2C" }}
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="flex flex-col gap-10 max-h-[100vh] mx-5  relative ">
        <div
          id="popup-modal"
          tabIndex="-1"
          className={`fixed  left-0 top-0 z-50 ${
            isModalOpen ? "block" : "hidden"
          } p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
        >
          <div
            className="fixed inset-0 bg-black opacity-50 cursor-pointer"
            onClick={closeDeleteModal}
          ></div>

          <div className="absolute left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%] w-1/5 ">
            <div className="relative bg-white-300 rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modalhide="popup-modal"
              >
                <svg
                  className="w-3 h-3  text-gray"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>

              <div className="p-6 text-center">
                <svg
                  className="mx-auto mb-4 text-gray w-12 h-12 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray">
                  Sei sicuro di eliminare questo utente?
                </h3>

                <button
                  datamodalhide="popup-modal"
                  onClick={() => deleteUser()}
                  type="button"
                  className="text-white-100 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                >
                  Si, sono sicuro
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  datamodalhide="popup-modal"
                  type="button"
                  className="text-gray bg-white-300 hover:bg-white-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  No, torna indietro
                </button>
              </div>
            </div>
          </div>
        </div>

        <ButtonCloseWindow />
        <TitleCard text="Gestione utenti" />
        <div className="flex font-montserrat">
          <select
            className="bg-gray text-secondary-300 border border-white-100 py-1 outline-none rounded-md pl-3"
            onChange={selectChoose}
          >
            <option value="default">Default</option>
            <option value="nome">Nome</option>
            <option value="scheda">Scadenza scheda</option>
            <option value="abbonamento">Scadenza abbonamento</option>
          </select>

          <input
            type="text"
            className="ml-auto bg-gray text-secondary-300 font-montserrat pl-3 border outline-none rounded-md border-white-100"
            placeholder="Cerca utente"
            onInput={searchMember}
            value={searchValue}
          />

          <button
            className=" transform -translate-y-1/2 focus:outline-none relative top-2 right-4"
            onClick={clearSearchText}
          >
            <img src={cancel} alt="" className=" w-3  " />
          </button>
        </div>

        <div className="bg-white-00 border border-slate-300 rounded-xl w-full mx-auto bg-gray ">
          <table className="w-full ">
            <thead>
              <tr className="border-bot border-slate-300 text-secondary-100 font-roboto font-bold text-xl">
                <th className="py-5">Lista utenti</th>
                <th>Rinnovato il</th>
                <th>Scadenza scheda</th>
                <th>N. Tessera</th>
                <th>Scadenza abbonamento</th>
              </tr>
            </thead>
            <tbody className="w-full font-montserrat  ">
              {data && data.length === 0 ? (
                <tr className="border-t border-slate-300 text-white-100 text-center">
                  <td className=" text-secondary-100 font-roboto font-bold text-xl  py-5">
                    No user
                  </td>
                </tr>
              ) : (
                data &&
                data.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-slate-300 text-white-100 text-center"
                  >
                    <td className="py-5">
                      <button className="underline decoration-1 hover:text-secondary-300">
                        {user.username}
                      </button>
                    </td>

                    {convertDate(user.subscription)}
                    <td>{renewalDate}</td>

                    <td>
                      {user.cardExpiry ? (
                        isCardExpired(user.cardExpiry) ? (
                          <button className="text-red-200 text-center underline decoration-1 font-montserrat font-normal hover:text-red-600">
                            Scaduto
                          </button>
                        ) : (
                          <span className="underline decoration-1 ">
                            {user.cardExpiry}
                          </span>
                        )
                      ) : (
                        <button className=" text-green-200 text-center underline decoration-1 font-montserrat font-normal hover:text-green-100">
                          Aggiungi scheda
                        </button>
                      )}
                    </td>

                    <td>{user.passNumber}</td>

                    {/* {isSubscribedExpired(user.subscritionExp) ? (
                      <td>
                        <button
                          className="text-red-200 text-center underline decoration-1 font-montserrat  font-normal hover:text-red-600"
                          onClick={() => openCalendar(user.id)}
                        >
                          Scaduto
                        </button>
                      </td>
                    ) : (
                      <td>
                        <button
                          className="text-white-100 text-center underline decoration-1 font-montserrat  font-normal hover:text-secondary-300 "
                          onClick={() => openCalendar(user.id)}
                        >
                          {user.subscritionExp}
                        </button>
                      </td>
                    )} */}

                    <td>
                      <button
                        onClick={() => openDeleteModals(true, user.id)}
                        data-modaltarget="popup-modal"
                        data-modaltoggle="popup-modal"
                        className=" transform -translate-y-1/2 focus:outline-none relative top-2 right-4"
                      >
                        <img src={garbage} alt="" className=" w-3  " />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isCalendarOpen}
        onRequestClose={closeCalendar}
        contentLabel="Calendar Modal"
      >
        <div>
          <h2 className="text-red-200">Seleziona la nuova data:</h2>

          <div>
            <Calendar
              value={subscriptionExp}
              onChange={handleSubscriptionExpChange}
              className="text-center px-9 [&>*:first-child]:text-red-200 right-10 w-full "
              minDate={new Date()}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
