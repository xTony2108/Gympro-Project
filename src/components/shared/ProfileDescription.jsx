import proPic from "../../assets/images/placeholders/noPicture.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export const ProfileDescription = ({
  name,
  email,
  tel,
  isGym,
  subscription,
}) => {
  const handleMouseEnter = () => {
    const icon = document.querySelector(".fa-camera");
    icon.style.display = "block";
  };

  const handleMouseExit = () => {
    const icon = document.querySelector(".fa-camera");
    icon.style.display = "none";
  };

  return (
    <div
      className={clsx(
        "flex p-8 bg-gray rounded-2xl justify-between",
        isGym && "p-6"
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-secondary-100 font-bold text-2xl">{name}</p>
        {isGym && (
          <>
            <p className="w-fit font-montserrat flex items-center text-white-100 gap-3 font-normal ">
              <FontAwesomeIcon
                size="2xl"
                icon="fa-solid fa-users"
                style={{ color: "#46af4d" }}
              />
              Utenti registrati: {}
            </p>
          </>
        )}
        {!isGym && (
          <>
            <div className="flex gap-20 justify-center items-center">
              <div className="flex flex-col justify-center gap-2 h-full">
                <button className="w-fit font-montserrat flex items-center text-white-100 gap-3 font-normal underline underline-offset-4 hover:text-secondary-300">
                  <span className="block">
                    <FontAwesomeIcon
                      icon="fa-solid fa-dumbbell"
                      size="xl"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  Scheda
                </button>
                <p className="flex items-center text-white-100 gap-3">
                  <span className="block">
                    <FontAwesomeIcon
                      icon="fa-solid fa-calendar-xmark"
                      size="xl"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  Scadenza abbonamento: {subscription}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2 h-full">
                <p className="flex items-center text-white-100 gap-3">
                  <span className="block">
                    <FontAwesomeIcon
                      icon="fa-solid fa-envelope"
                      size="xl"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  {email}
                </p>
                <p className="flex items-center text-white-100 gap-3">
                  <span className="block">
                    <FontAwesomeIcon
                      icon="fa-solid fa-phone"
                      size="xl"
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  {tel}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <button
        className="w-24 h-24 rounded-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseExit}
      >
        <FontAwesomeIcon
          icon="fa-solid fa-camera"
          size="2xl"
          style={{
            color: "#ffffff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(${-50}%, ${-50}%)`,
            display: "none",
          }}
        />
        <img
          src={proPic}
          alt="profile picture"
          className="rounded-full hover:opacity-20"
        />
      </button>
    </div>
  );
};