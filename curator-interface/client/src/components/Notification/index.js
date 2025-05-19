import { InlineNotification, ToastNotification } from "@carbon/react";

import "./style.scss";
import Language from "../../helpers/languagesConfig";
import { useParams } from "react-router-dom";

export function Notification({
  setShowNotification,
  notificationContent,
  setNotificationContent,
}) {
  const { language } = useParams();
  return (
    <ToastNotification
      className="notification"
      ariaLabel="closes notification"
      timeout={7999}
      onClose={() => {
        setShowNotification(false);
        setNotificationContent({
          title: Language[language].notification.title,
          text: Language[language].notification.txt,
          kind: "info",
        });
      }}
      onCloseButtonClick={() => {
        setShowNotification(false);
        setNotificationContent({
          title: Language[language].notification.title,
          text: Language[language].notification.txt,
          kind: "info",
        });
      }}
      statusIconDescription="notification"
      kind={notificationContent?.kind}
      subtitle={notificationContent?.text}
      title={notificationContent?.title}
    />
  );
}
